import { Model, Optional, DataTypes } from 'sequelize'
import moment from 'moment'
import db from './connect'
import User from './user'

export interface SessionAttributes {
  id: string
  token?: string
  userId: string
  expiresAt?: Date
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null

  user?: typeof User
}

interface FormattedSession {
  token: string
  expiresAt: Date
}

interface SessionCreateAttrs extends Optional<SessionAttributes, 'id'> {}


export interface SessionInstance extends
  Model<SessionAttributes, SessionCreateAttrs>,
  SessionAttributes {
    format(): FormattedSession
  }

const Session = db.sequelize.define<SessionInstance>('session', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  token: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: DataTypes.UUIDV4,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'session',
})


/**
 * hooks
 */

Session.addHook('beforeCreate', (instance: SessionInstance) => {
  instance.expiresAt = moment().add(14, 'd').toDate()
})

Session.prototype.format = function() {
  return {
    token: this.token,
    expiresAt: moment(this.expiresAt).toISOString()
  }
}


export default Session
