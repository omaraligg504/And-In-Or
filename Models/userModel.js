const { sequelize } = require("./server");
const { DataTypes } = require("sequelize");
const validate = require("validator");
const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "User must have a name",
      },
      len: {
        args: [5, 20],
        msg: "User Name must be betweeb 5 to 20 charachters",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "This email is already registered",
    },
    validate: {
      notNull: {
        msg: "Please provide an email",
      },
      isEmailValid(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter valid email");
        }
      },
    },
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: "default.jpg",
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "User must have a role",
      },
      isIn: {
        args: [["user", "supervisor"]],
        msg: "Invalid role",
      },
    },
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    select: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "User must have a password",
      },
      len: {
        args: [8],
        msg: "User Name must be at least 8 charachters",
      },
    },
    select: false,
  },

  confirmPassword: {
    type: DataTypes.STRING,
    validate: {
      confirmPasswordMatch(value) {
        if (value !== this.password) {
          throw new Error("Unmatched Password");
        }
      },
    },
  },
  passwordChangeAt: DataTypes.DATE,
  passwordResetToken: DataTypes.STRING,
  passwordResetExpires: DataTypes.DATE,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    select: false,
  },

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "User must have a phone number",
      },
    },
  },
  address: {
    forignKey: true,
  },
});
