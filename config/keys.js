module.exports = {
  database: {
    // Si se usara una base de datos en otro servidor aquí se colocaría la url de dicha base de datos
    URI:
      'mongodb://miguelangeltorresfp:U8YkUb3H41z1Dh18cSstMWA2Z@ds137540.mlab.com:37540/fashionbiz20',
  },
  secretOrKey: process.env.TOKEN_SECRET || 'tokenultrasecreto',
};
