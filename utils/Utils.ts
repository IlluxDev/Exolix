import deepmerge from "deepmerge";

class Utils {
	public merge<ObjectType>(item1: ObjectType, item2: ObjectType): ObjectType {
		return deepmerge({ ...item1 }, { ...item2 });
	}
}

const utils = new Utils();
export { utils };
