const { sequelize } = require("./server");
const { DataTypes, DATE } = require("sequelize");
const validate = require("validator");
const address=sequelize.define('Address',{
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true
    },
    unitNumber:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:'Address must have a unit number'
            },
            
        }
    },
    streetNumber:{
        type: DataTypes.STRING
    },
    addressLine1:{
        type:DataTypes.STRING
    },
    addressLine2:{
        type:DataTypes.STRING
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:'Address must have a city'
            },
        }
    },
    region:{
        type:DataTypes.STRING
    },
    postalCode:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:'Address must have a postal code'
            },
            
        },
        country:{
            name:DataTypes.STRING,
            allowNull:false,
        validate:{
            notNull:{
                msg:'Address must have a country'
            },
        }
        }
    }

})