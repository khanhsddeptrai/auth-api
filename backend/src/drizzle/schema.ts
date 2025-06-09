import { relations } from 'drizzle-orm';
import { int, mysqlTable, serial, varchar, boolean, timestamp, json, primaryKey } from 'drizzle-orm/mysql-core';

//=====================================Định nghĩa các bảng trong cơ sở dữ liệu=============================================
// Bảng user
export const User = mysqlTable('user', {
    id: int({ unsigned: true }).autoincrement().primaryKey(),
    full_name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    is_active: boolean().notNull().default(true),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().onUpdateNow(),
});

// Bảng role
export const Role = mysqlTable('role', {
    id: int({ unsigned: true }).autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 })
});


// Bảng trung gian user_role
export const UserRole = mysqlTable('user_role', {
    user_id: int({ unsigned: true }).notNull().references(() => User.id),
    role_id: int({ unsigned: true }).notNull().references(() => Role.id),
},
    (t) => [
        primaryKey({ columns: [t.user_id, t.role_id] })
    ]
)
// Bảng permission
export const Permission = mysqlTable('permission', {
    id: int({ unsigned: true }).autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 })
});

// Bảng trung giang permission_role
export const PermissionRole = mysqlTable('permission_role', {
    permission_id: int({ unsigned: true }).notNull().references(() => Permission.id),
    role_id: int({ unsigned: true }).notNull().references(() => Role.id),
},
    (t) => [
        primaryKey({ columns: [t.permission_id, t.role_id] })
    ]);

// Bảng login_attemp
export const LoginAttemp = mysqlTable('login_attemp', {
    id: int({ unsigned: true }).autoincrement().primaryKey(),
    userId: int({ unsigned: true }).references(() => User.id),
    device_info: json().notNull(),
    ip_address: varchar({ length: 45 }).notNull(),
    is_success: boolean().notNull(),
    attempted_at: timestamp().notNull().defaultNow()
});

// Bảng session
export const Session = mysqlTable('session', {
    id: int({ unsigned: true }).autoincrement().primaryKey(),
    userId: int({ unsigned: true }).notNull().references(() => User.id),
    refresh_token: varchar({ length: 255 }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
    expires_at: timestamp().notNull(),
    ip_address: varchar({ length: 45 }).notNull(),
    is_valid: boolean().notNull().default(false),
    device_info: json().notNull()
});

//=====================================Định nghĩa các quan hệ trong cơ sở dữ liệu=============================================


// Quan hệ bảng user
export const UserRelation = relations(User, ({ many }) => ({
    UserRole: many(UserRole),
    LoginAttemp: many(LoginAttemp),
    Session: many(Session)
}))

// Quan hệ bảng role 
export const RoleRelation = relations(Role, ({ many }) => ({
    UserRole: many(UserRole),
    PermissionRole: many(PermissionRole)
}))

// Quan hệ bảng user_role
export const UserRoleRelation = relations(UserRole, ({ one }) => ({
    role: one(Role, {
        fields: [UserRole.role_id],
        references: [Role.id]
    }),
    user: one(User, {
        fields: [UserRole.user_id],
        references: [User.id]
    })
}))

// Quan hệ bảng permission
export const Permissionlation = relations(Permission, ({ many }) => ({
    PermissionRole: many(PermissionRole)
}))

// Quan hệ bảng permission_role
export const PermissionRoleRelation = relations(PermissionRole, ({ one }) => ({
    role: one(Role, {
        fields: [PermissionRole.role_id],
        references: [Role.id]
    }),
    permission: one(Permission, {
        fields: [PermissionRole.permission_id],
        references: [Permission.id]
    })
}))

// Quan hệ bảng login_attemp
export const LoginAttempRelation = relations(LoginAttemp, ({ one }) => ({
    user: one(User, {
        fields: [LoginAttemp.userId],
        references: [User.id]
    })
}))

// Quan hệ bảng session
export const SessionRelation = relations(Session, ({ one }) => ({
    user: one(User, {
        fields: [Session.userId],
        references: [User.id]
    })
}))
