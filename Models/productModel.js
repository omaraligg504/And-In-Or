const { sequelize } = require("./server");
const { DataTypes } = require("sequelize");
const validate = require("validator");
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Product must have a name",
      },
      len: {
        args: [1, 100],
        msg: "Product Name must be betweeb 1 to 100 charachters",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [500],
        msg: "Product descriptoin at most 500 chars",
      },
    },
  },
  modelHeight: {},
});
