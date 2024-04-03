'use strict';

class User {
	constructor(id, firstName, lastName, jobTitle) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.jobTitle = jobTitle;
	};

	getFullName() {
		return `${this.firstName} ${this.lastName}`;
	};

};

class UserService extends User {
	constructor(id, firstName, lastName, jobTitle) {
		super(id, firstName, lastName, jobTitle);
		this.usersApiUrl = 'https://dummyjson.com/users';
		this.users = [];
	};

	async fetchUsers() {
		const response = await fetch(this.usersApiUrl);
		try {
			if (response.ok) {
				const data = await response.json();
				this.users = data.users.map(user => new User(user.id, user.firstName, user.lastName, user.company.title));
				return this.users;
			} else {
				throw new Error(`Something went wrong. Reason: ${response.status}`);
			};
		} catch (error) {
			console.error(error);
			return [];
		}
	};

	getUserById(id) {
		let user = this.users.find(user => user.id === id);
		return user;
	};
};

class Speakers extends UserService {
	constructor() {
		super();
		this.speakers = [];
		this.imgApiUrl = 'https://api.lorem.space/image/face?w=320&h=320&r';
	};

	async getSpeakers(amount) {
		await this.fetchUsers().then(() => {
			for(let i = 1; i <= amount; i++) {
				let speaker = this.getUserById(i);
				if (speaker) {
					this.speakers.push(speaker);
				} else {
					console.error(`Users don't fetched`);
				}
			}
		}).catch(error => console.error(error));
	};

	async renderSpeakers(amount) {
		await this.getSpeakers(amount).then(() => {
			this.speakers.forEach(speaker => {
				var speakerDescription = document.getElementById(`member${speaker.id}`);
				var speakerImg = speakerDescription.querySelector('.lector__image');
				speakerImg.src = `${this.imgApiUrl}=${speaker.id}`;
				speakerImg.alt = `${speaker.firstName} ${speaker.lastName} photo`;
				var speakerName = speakerDescription.querySelector('.lector__name');
				speakerName.insertAdjacentText('afterbegin', `${speaker.firstName} ${speaker.lastName}`);
				var speakerJob = speakerDescription.querySelector('.lector__job');
				speakerJob.insertAdjacentText('afterbegin', `${speaker.jobTitle}`);
			});
		});
	};
};

class Schedule extends Speakers {
	constructor() {
		super();
	};

	async renderSpeakers(amount) {
		await this.getSpeakers(amount).then(() => {
			this.speakers.forEach(speaker => {
				var speakerDescription = document.getElementById(`lector${speaker.id}`);
				var speakerName = speakerDescription.querySelector('.members-of-program__name');
				speakerName.insertAdjacentText('afterbegin', `${speaker.firstName} ${speaker.lastName}`);
			});
		});
	}
}

const speakers = new Speakers();
speakers.renderSpeakers(6);
const schedule = new Schedule();
schedule.renderSpeakers(9);