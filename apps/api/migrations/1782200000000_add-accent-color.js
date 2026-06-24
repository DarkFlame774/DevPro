exports.up = (pgm) => {
  pgm.addColumn('profiles', {
    accent_color: { type: 'varchar(20)', default: "'blue'", notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('profiles', 'accent_color');
};
