const {randomBytes} = require('crypto');
const {promisify} = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {transport, emailHtml} = require('../mail');
const {hasPermission} = require('../utils');

const Mutations = {
	createItem(parent, args, ctx, info) {
		if (!ctx.request.userId) {
			throw new Error('You must be logged in to do that');
		}

		return ctx.db.mutation.createItem({
			data: {
				user: {connect: {id: ctx.request.userId}},
				...args
			}
		}, info);
	},

	updateItem(parent, args, ctx, info) {
		const updates = {...args};
		delete updates.id;
		return ctx.db.mutation.updateItem({
			data: {...updates},
			where: {id: args.id}
		}, info);
	},

	async deleteItem(parent, args, ctx, info) {
		if (!ctx.request.userId) {
			throw new Error('Log in first');
		}

		const where = {id: args.id};
		const item = await ctx.db.query.item({where}, `{id title user {id}}`);
		const ownsItem = item.user.id === ctx.request.userId;
		const hasPermissions = ctx.request.user.permissions.some(permission => {
			return ['ADMIN', 'ITEMDELETE'].includes(permission);
		});

		if (!ownsItem && !hasPermissions) {
			throw new Error('You don\'t have the necessary permissions to do that')
		}

		return ctx.db.mutation.deleteItem({where}, info);
	},

	async signup(parent, args, ctx, info) {
		args.email = args.email.toLowerCase();
		args.password = await bcrypt.hash(args.password, 10);
		args.permissions = {set: ['USER']};
		const user = await ctx.db.mutation.createUser({data: {...args}}, info);

		const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		});

		return user;
	},

	async signin(parent, {email, password}, ctx, info) {
		const user = await ctx.db.query.user({where: {email}});

		if (!user) {
			throw new Error(`No such user found for email ${email}`);
		}

		const valid = await bcrypt.compare(password, user.password);

		if (!valid) {
			throw new Error('Invalid Password')
		}

		const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);

		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		});

		return user;
	},

	async signout(parent, args, ctx, info) {
		ctx.response.clearCookie('token', {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		});

		return {message: 'Success'};
	},

	async requestReset(parent, {email}, ctx, info) {
		const user = await ctx.db.query.user({where: {email}});

		if (!user) {
			throw new Error(`No such user found for email ${email}`);
		}

		const resetToken = (await promisify(randomBytes)(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000;
		
		await ctx.db.mutation.updateUser({
			where: {email},
			data: {resetToken, resetTokenExpiry}
		});

		const mailRes = await transport.sendMail({
			from: 'mail@danwebb.co',
			to: user.email,
			subject: 'Your password reset',
			html: emailHtml(`
				<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
					Click here to reset your password
				</a>
			`)
		});

		return {message: 'Success'};
	},

	async resetPassword(parent, {resetToken, password, confirmPassword}, ctx, info) {
		if (password !== confirmPassword) {
			throw new Error('Please make sure your passwords match');
		}

		const [user] = await ctx.db.query.users({
			where: {
				resetToken,
				resetTokenExpiry_gte: Date.now() - 3600000
			}
		});

		if (!user) {
			throw new Error('The reset period expired, please request a new reset');
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const updatedUser = await ctx.db.mutation.updateUser({
			where: {email: user.email},
			data: {password: passwordHash, resetToken: null, resetTokenExpiry: null}
		});

		const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365
		});

		return updatedUser;
	},

	updatePermissions(parent, args, ctx, info) {
		if (!ctx.request.userId) {
			throw new Error('Log in first');
		}

		const user = ctx.request.user;
		hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);
		return ctx.db.mutation.updateUser({
			data: {permissions: {set: args.permissions}},
			where: {id: args.userId}
		}, info);
	},

	async addToCart(parent, args, ctx, info) {
		if (!ctx.request.userId) {
			throw new Error('Log in first');
		}

		const [existingCartItem] = await ctx.db.query.cartItems({
			where: {
				user: {id: ctx.request.userId},
				item: {id: args.id}
			}
		});

		if (existingCartItem) {
			return ctx.db.mutation.updateCartItem({
				where: {id: existingCartItem.id},
				data: {quantity: existingCartItem.quantity + 1}
			}, info);
		}

		return ctx.db.mutation.createCartItem({
			data: {
				user: {connect: {id: ctx.request.userId}},
				item: {connect: {id: args.id}}
			}
		}, info);
	}
};

module.exports = Mutations;
