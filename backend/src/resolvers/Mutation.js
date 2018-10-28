const Mutations = {
	createItem(parent, args, ctx, info) {
		return ctx.db.mutation.createItem({data: {...args}}, info);
	}
};

module.exports = Mutations;
