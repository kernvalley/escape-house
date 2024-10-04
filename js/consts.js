export const GA = null;

export const env = (location.hostname === 'localhost' || location.hostname.endsWith('.netlify.live'))
	? 'development'
	: 'production';

export const dev = env === 'development';

export const site = {
	title: 'Static Template',
};

export const chapters = [{
	id: 'faad3bf2-b002-4e22-a360-8b7d1dddfcb4',
	vid: 'edCrrWj6WK4',
	q: 'How much would could a wood chuck chuck?',
	width: 560,
	height: 350,
	a: '42',
	opts: [1, 24, 42, 69],
}, {
	id: '4da2d55e-32c5-4293-962c-b1f6ca91a08d',
	vid: 'edCrrWj6WK4',
	q: 'How much would could a wood chuck chuck?',
	width: 560,
	height: 350,
	a: '42',
	opts: [1, 24, 42, 69],
}];
