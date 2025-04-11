import roleModel from "../models/roles.model.js";

const createRoles = async () => {
  try {
    const listRoles = ["user", "admin"];
    const existingRoles = await roleModel.find({ name: { $in: listRoles } });

    const existingRoleNames = existingRoles.map((role) => role.name);
    const rolesToCreate = listRoles.filter(
      (role) => !existingRoleNames.includes(role)
    );

    if (rolesToCreate.length === 0) {
      console.log("Roles ya creados");
      return;
    }

    for (const roleName of rolesToCreate) {
      const newRole = new roleModel({ name: roleName });
      await newRole.save();
      console.log(`El rol faltante "${roleName}" fue creado`);
    }
  } catch (error) {
    console.log("Error al crear roles:", error);
  }
};

export default createRoles;