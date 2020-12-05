import API from'./fetchCountries';
import countryCardTpl from './templates/markupTpl.hbs';
import fewCountryTpl from './templates/fewCountryTpl.hbs';
const debounce = require('lodash.debounce');
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

const container = document.querySelector('.container');
const searchForm = document.querySelector('.js-form');

searchForm.addEventListener('input', _.debounce(onSearch, 500));


let searchQuery = "";
let form = undefined;

function onSearch(evt) {
    evt.preventDefault();
    form = evt.target;
    searchQuery = evt.target.value;

    API.fetchCountries(searchQuery)
    .then(response => {
        if(response.length === 1){
            const fewCountry = document.querySelector('.few-country');
            fewCountry.remove();
            renderCountryCard(response);
        }
        if(response.length >= 2 && response.length <= 10){
            renderFewCountry(response)
        }
        if(response.length > 10){
            click()
        };
    })
    // .catch(onFetchError)
    // .finally(()=> {
    //     form.parentNode.reset();
    // })
};

function renderFewCountry(country) {
    const fewCountryMarkup = fewCountryTpl(country); 
    container.insertAdjacentHTML('beforeend', fewCountryMarkup);
};

function renderCountryCard (country) {
    const markup = countryCardTpl(country);
    container.insertAdjacentHTML('beforeend', markup);
    searchForm.addEventListener('change', newSearch);
    function newSearch(){
        if(markup){
            location.reload();
        };
    }
};

function onFetchError(error) {
    alert('Что-то не так, проверьте поиск');
};

function click() {
    error({
      text:
        "Too many matches found. Please enter a more specific query!",
      modules: new Map([
        [
          
          {
            
            confirm: true,
            buttons: [
              {
                text: "Ok",
                primary: true,
                click: notice => {
                  notice.close();
                }
              }
            ]
          }
        ]
      ])
    });
  };

