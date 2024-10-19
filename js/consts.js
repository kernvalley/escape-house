export const GA = null;

export const env = (location.hostname === 'localhost' || location.hostname.endsWith('.netlify.live'))
	? 'development'
	: 'production';

export const dev = env === 'development';

export const site = {
	title: 'Halloween Escape House',
};

export const chapters = [{
	// Chapter 1... No question
	id: 'faad3bf2-b002-4e22-a360-8b7d1dddfcb4',
	// vid: 'w99WXGz96sk',
	vid: 'R5tn08h0W1M',
	width: 560,
	height: 315,
}, {
	// Chapter 2... No question
	id: '4da2d55e-32c5-4293-962c-b1f6ca91a08d',
	// vid: '4L2n7_92A1s',
	vid: 'getqtyP-P9c',
	width: 560,
	height: 315,
}, {
	// Chapter 3
	id: 'ae9b3d38-a7e1-4bb7-a46f-7037089a9976',
	// vid: 'J5CdXcCABU0',
	vid: '8elxTDIgxiY',
	q: 'What was he struggling with getting used to?',
	width: 560,
	height: 315,
	opts: ['The quiet', 'The change of environment', 'The altitude', 'The water'],
	a: 3,
}, {
	// Chapter 4
	id: '1f0f5297-597f-4fa7-92c3-d13b273bf7f7',
	// vid: 'U70wTL78fe8',
	vid: 'Uxo5RBfS_PE',
	q: 'Was keeping him up at night?',
	width: 560,
	height: 315,
	opts: ['His bad neck', 'His tooth', 'The sounds and animals', 'A dog bite'],
	a: 2,
}, {
	// Chapter 5
	id: 'bcb3eea-753a-4f54-b3f0-298caeac7d47',
	// vid: 'PfgiU5qBWUE',
	vid: '8X5o-MiKmhg',
	q: 'What was the neighbor doing?',
	width: 560,
	height: 315,
	opts: ['Walking her dog', 'Borrowing a ladder', 'Helping with chores', 'Inviting him to a BBQ'],
	a: 0,
}, {
	// Chapter 6 - Final
	id: 'c78c8050-5de6-4448-ade9-4abc23687cef',
	// vid: 'U70wTL78fe8',
	vid: 'SB4j2IeUemQ',
	q: 'What sounds were disturbing him?',
	width: 560,
	height: 315,
	opts: ['A dripping faucet', 'His imagination', 'The neighbor\'s music', 'The animals'],
	a: 3,
}];
