const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
	createItem(parent, args, ctx, info) {
		return ctx.db.mutation.createItem({data: {...args}}, info);
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
		const where = {id: args.id};
		const item = await ctx.db.query.item({where}, `{id, title}`);
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
	}
};

module.exports = Mutations;
