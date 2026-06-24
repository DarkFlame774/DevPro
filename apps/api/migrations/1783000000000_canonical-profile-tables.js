exports.up = (pgm) => {
  // 1. Create the new raw_platform_data table
  pgm.createTable("raw_platform_data", {
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" },
    platform: { type: "varchar(50)", notNull: true },
    raw_json: { type: "jsonb", notNull: true },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  // Ensure a user only has one raw data entry per platform
  pgm.addConstraint("raw_platform_data", "raw_platform_data_pkey", {
    primaryKey: ["user_id", "platform"]
  });

  // 2. Create user_overrides table
  pgm.createTable("user_overrides", {
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" },
    entity_type: { type: "varchar(50)", notNull: true }, // e.g., 'identity', 'project'
    entity_id: { type: "varchar(100)", notNull: true },  // e.g., 'profile', 'gh-repo-123'
    override_data: { type: "jsonb", notNull: true },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.addConstraint("user_overrides", "user_overrides_pkey", {
    primaryKey: ["user_id", "entity_type", "entity_id"]
  });

  // 3. Migrate existing data from github_data to raw_platform_data
  pgm.sql(`
    INSERT INTO raw_platform_data (user_id, platform, raw_json, updated_at)
    SELECT 
      user_id, 
      'github', 
      jsonb_build_object(
        'profile', profile_json, 
        'repos', repos_json, 
        'stats', stats_json
      ), 
      updated_at
    FROM github_data
    ON CONFLICT DO NOTHING;
  `);

  // 4. Migrate existing data from leetcode_data to raw_platform_data
  pgm.sql(`
    INSERT INTO raw_platform_data (user_id, platform, raw_json, updated_at)
    SELECT 
      user_id, 
      'leetcode', 
      jsonb_build_object('stats', stats_json), 
      updated_at
    FROM leetcode_data
    ON CONFLICT DO NOTHING;
  `);

  // 5. Drop the old tables
  pgm.dropTable("github_data");
  pgm.dropTable("leetcode_data");
};

exports.down = (pgm) => {
  // Recreate github_data
  pgm.createTable("github_data", {
    user_id: { type: "uuid", primaryKey: true, references: "users(id)", onDelete: "CASCADE" },
    profile_json: { type: "jsonb" },
    repos_json: { type: "jsonb" },
    stats_json: { type: "jsonb" },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") }
  });

  // Recreate leetcode_data
  pgm.createTable("leetcode_data", {
    user_id: { type: "uuid", primaryKey: true, references: "users(id)", onDelete: "CASCADE" },
    stats_json: { type: "jsonb" },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") }
  });

  // Migrate data back
  pgm.sql(`
    INSERT INTO github_data (user_id, profile_json, repos_json, stats_json, updated_at)
    SELECT 
      user_id, 
      raw_json->'profile', 
      raw_json->'repos', 
      raw_json->'stats', 
      updated_at
    FROM raw_platform_data
    WHERE platform = 'github';
  `);

  pgm.sql(`
    INSERT INTO leetcode_data (user_id, stats_json, updated_at)
    SELECT 
      user_id, 
      raw_json->'stats', 
      updated_at
    FROM raw_platform_data
    WHERE platform = 'leetcode';
  `);

  // Drop new tables
  pgm.dropTable("user_overrides");
  pgm.dropTable("raw_platform_data");
};
