exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};

exports.get500 = (error, req, res, next) => {
  console.log({error})
  res.status(500).render('500', { pageTitle: 'Something Went Wrong', path: '/500' });
};
