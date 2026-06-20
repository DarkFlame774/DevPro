exports.up = (pgm) => {
  // UUID Extension
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Users Table
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    email: { type: 'varchar(255)', unique: true, notNull: false },
    password_hash: { type: 'varchar(255)', notNull: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Platform Connections Table
  pgm.createTable('platform_connections', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    platform: { type: 'varchar(50)', notNull: true },
    platform_username: { type: 'varchar(255)', notNull: true },
    access_token: { type: 'varchar(255)' },
    last_sync_at: { type: 'timestamp' },
    status: { type: 'varchar(50)', notNull: true, default: "'connected'" },
  });
  
  // Enforce one connection per platform per user
  pgm.addConstraint('platform_connections', 'unique_user_platform', {
    unique: ['user_id', 'platform']
  });

  // GitHub Data Table
  pgm.createTable('github_data', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    user_id: { type: 'uuid', notNull: true, unique: true, references: 'users(id)', onDelete: 'CASCADE' },
    profile_json: { type: 'jsonb' },
    repos_json: { type: 'jsonb' },
    stats_json: { type: 'jsonb' },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // LeetCode Data Table
  pgm.createTable('leetcode_data', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    user_id: { type: 'uuid', notNull: true, unique: true, references: 'users(id)', onDelete: 'CASCADE' },
    stats_json: { type: 'jsonb' },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Profiles Table
  pgm.createTable('profiles', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    user_id: { type: 'uuid', notNull: true, unique: true, references: 'users(id)', onDelete: 'CASCADE' },
    slug: { type: 'varchar(100)', unique: true, notNull: true },
    template: { type: 'varchar(50)', notNull: true, default: "'minimal'" },
    is_public: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('profiles');
  pgm.dropTable('leetcode_data');
  pgm.dropTable('github_data');
  pgm.dropTable('platform_connections');
  pgm.dropTable('users');
};
