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
    try {
      await RoleModel.findOneAndUpdate(
        { name: "super-admin" },
        {
          name: "super-admin",
          permissions,
          is_active: true,
        },
        { upsert: true, new: true }
      ).exec();
    } catch (err) {
      console.log(err);
    }
    const role = await RoleModel.findOne({ name: "super-admin" }).exec();
    console.log("super-admin role created");
    // console.log(role);
    const admin = await Employee.findOne({ email: "admin@admin.com" }).exec();
    if (admin) {
      console.log("super-admin already created");
      admin.role_id = role._id;
      admin.is_banned = false;
      await admin.save();
      return;
    }
    await Employee.create({
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
