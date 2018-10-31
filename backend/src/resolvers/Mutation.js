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
	}
};

module.exports = Mutations;
