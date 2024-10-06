export const GA = null;

export const env = (location.hostname === 'localhost' || location.hostname.endsWith('.netlify.live'))
	? 'development'
	: 'production';

export const dev = env === 'development';

export const site = {
	title: 'Halloween Escape House',
};

export const chapters = [{
	id: 'faad3bf2-b002-4e22-a360-8b7d1dddfcb4',
	vid: 'o6fxiitfh0w',
	width: 475,
	height: 845,
}, {
	id: '4da2d55e-32c5-4293-962c-b1f6ca91a08d',
	vid: '24XwveAmDEk',
	q: 'How much would could a wood chuck chuck? (2)',
	width: 475,
	height: 845,
	a: '42',
	opts: [1, 24, 42, 69],
}, {
	id: 'ae9b3d38-a7e1-4bb7-a46f-7037089a9976',
	vid: 'U70wTL78fe8',
	q: 'How much would could a wood chuck chuck? (3)',
	width: 475,
	height: 845,
	a: '42',
	opts: [1, 24, 42, 69],
}];
