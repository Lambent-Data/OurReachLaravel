/* Environment variables for js */

//(subdomain === 'development' || subdomain === 'demo' || subdomain === 'younglives');
const subdomain = 'development';
const runningLocal = Boolean(parseInt($('body').attr('data-local')));

//console.log("Subdomain: ", subdomain);

const userIconsPath = 'https://' + subdomain + '.ourreachld.com/ourreach/uploads/users/';
const noImagePath = 'https://' + subdomain + '.ourreachld.com/ourreach/images/no_photo.png';

const endpoint = runningLocal ? 'http://localhost/' : 'https://' + subdomain + '.ourreachld.com/';

/* This is on the way out. Ignore for now. (Aug 22) */
const secure = false;
const ruko_endpoint = 'https://' + subdomain + '.ourreachld.com/ourreach/index.php?module=ldbackend/';

export { secure, subdomain, runningLocal, userIconsPath, noImagePath, endpoint, ruko_endpoint }