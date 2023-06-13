const RoleModel = require("../Components/Roles/Role");
const Employee = require("../Components/Employees/EmployeeSchema");

const access = {
  post: true,
  get: true,
  patch: true,
  delete: true,
  ban: true,
  unban: true,
  activate: true,
  deactivate: true,
};

const routes = [
  "categories",
  "products",
  "users",
  "roles",
  "employees",
  "orders",
  "settings",
];

const permissions = routes.map((route) => ({
  entity: route,
  access,
}));
// console.log(access);
// console.log(permissions);
module.exports = async () => {
  try {
    console.log("seeding roles");
    // const roles = await RoleModel.find().exec();
    // if (roles.length === 0) {
    const role = await RoleModel.updateOne(
      { name: "super-admin" },
      {
        name: "super-admin",
        permissions,
        is_active: true,
      },
      { upsert: true, new: true }
    );
    console.log("super-admin role created");
    console.log(role);
    const admin = await Employee.create({
      name: "super-admin",
      email: "admin@admin.com",
      password: "12345678",
      phone: "01123456789",
      role_id: role._id,
    });
    console.log("super-admin created");
    // }
  } catch (error) {
    console.log(error);
  }
};
// module.exports();
