import { Model, Optional, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from './connect'


export interface UserAttributes {
  id: string
  email: string
  firstName: string
  lastName: string
  password: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null

  newPassword?: string
}

interface FormattedUser {
  id: string
  email: string
  firstName: string
  lastName: string
}


interface UserCreateAttrs extends Optional<UserAttributes, 'id'> {}


export interface UserInstance extends
  Model<UserAttributes, UserCreateAttrs>,
  UserAttributes {
    comparePassword(password: string): Promise<boolean>
    setPassword(password: string): void
    format(): FormattedUser
  }

const User = db.sequelize.define<UserInstance>('user', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  paranoid: true,
  tableName: 'user',
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
})

function setPassword(instance: UserInstance, newPassword: string) {
  const saltRounds = 10
  const hash = bcrypt.hashSync(newPassword, saltRounds)
  instance.setDataValue('password', hash)
}

User.prototype.format = function (): FormattedUser {
  return {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
  };
}

User.prototype.setPassword = function (newPassword: string) {
  setPassword(this, newPassword);
}

User.prototype.comparePassword = function (password: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

/**
 * hooks
 */

User.addHook('beforeCreate', (instance: UserInstance) => {
  instance.setPassword(instance.password);
})

User.addHook('beforeUpdate', (instance: UserInstance) => {
  if (instance.newPassword) {
    setPassword(instance, instance.newPassword)
  }
})


export default User
