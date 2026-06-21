exports.up = (pgm) => {
  pgm.addColumn('profiles', {
    profile_data: { type: 'jsonb' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('profiles', 'profile_data');
};
