import React, { Component } from 'react'
import axios from 'axios';

export default class Board extends Component {
	state = {
		issues: []
	};

	// check if we have access to local storage
	checkLocalStorage() {
		const test = 'test';
		try {
			localStorage.setItem('test', test);
			localStorage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	}

	// first api call to check the header and work with it in the next function
	fetchPage(pageNumber) {
		return axios({
			url: `https://api.github.com/repos/microsoft/vscode/issues?page=${pageNumber}&state=all`,
			method: 'get',
			headers: {
				Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`, // personnal github access token
				'Content-Type': 'application/json'
			},
			auth: {
				username: `${process.env.REACT_APP_GITHUB_USERNAME}`, // github username
				password: `${process.env.REACT_APP_GITHUB_PASSWORD}` // github password
			}
		});
	}

	// function to know how many pages
	getNumberOfPages() {
		let firstPageNumber = 1; // we begin at page 1
		let lastPageNumber = null; // last page number to determine

		// @TO DO: explain this function
		this.fetchPage(firstPageNumber).then((promise) => {
			let pageLinks = promise.headers.link.split(',');
			let lastLink = null;
			let searchedString = 'page=';

			pageLinks.forEach((pageLink) => {
				if (pageLink.includes('rel="last"')) {
					lastLink = pageLink;
				}
			});

			let firstIndex = lastLink.search(searchedString);
			let pageNumberIsInThisString = lastLink.slice(firstIndex + searchedString.length);

			let number = [];
			for (let i = 0; i < pageNumberIsInThisString.length; i++) {
				if (!isNaN(pageNumberIsInThisString[i])) {
					number.push(pageNumberIsInThisString[i]);
				}
			}
			lastPageNumber = Number(number.join('').trim()); // join and clean the variable to make sure we get an integer
			console.log('number?', lastPageNumber);

			this.stockInLocalStorage(firstPageNumber, lastPageNumber); // now that we know how many pages there will be for our requests, do the request
		});
	}

	// finally, we can make the api calls
	async makeAPICalls(firstPageNumber, lastPageNumber) {
		let promises = []; // all promises we will need to make api calls
		let issues = []; // we will put the isssues from the promises here
		lastPageNumber = 3;

		// pushing each promise according to the number of pages for our request
		for (let i = firstPageNumber; i <= lastPageNumber; i++) {
			promises.push(this.fetchPage(i));
		}

		await axios
			.all(promises) // resolve the promises
			.then((res) => {
				res.forEach((groupedPromises) => {
					groupedPromises.data.forEach((promise) => issues.push(promise)); // stock the issues in the variable 'issues'
				});
			})
			.catch((err) => console.warn(err));

		console.log('issues?', issues);

		return issues;
    }
    
    // after the api calls, we stock the data in LocalStorage
	stockInLocalStorage = async (firstPageNumber, lastPageNumber) => {
		let issues = await this.makeAPICalls(firstPageNumber, lastPageNumber);
		console.log(issues);

		if (this.checkLocalStorage() === true) {
			console.log('LocalStorage available.');
			localStorage.setItem('issues', JSON.stringify(issues)); // put data in LocalStorage
			const localStorageDataToObject = JSON.parse(localStorage.getItem('issues'));
			this.setState({ issues: localStorageDataToObject }); // set state with data from LocalStorage
			console.log(localStorageDataToObject);
		} else {
			console.log('LocalStorage not available.');
			issues.forEach((issue) => {
				this.state.issues.push(issue); // putting the issues in the state directly
			});
		}
		console.log(this.state.issues);
	};

	async componentDidMount() {
		const issues = localStorage.getItem('issues');
		console.log('issues?', issues);
		if (issues === null) {
			this.getNumberOfPages();
		}
	}
	render() {
		return (<div>
            <h1>Hello I'm Board</h1>
        </div>)
            ;
	}
}
