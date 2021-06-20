import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { StorageService } from '../storage-service.service';

const KEY_LIVE_CASES = 'data.live';
const KEY_HISTORY_DEATHS = 'data.history.deaths';
const KEY_HISTORY_CONFIRMED = 'data.history.confirmed';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  data = {
    'live': {},
    'historyDeaths': {},
    'historyConfirmed': {}
  };

  stat = {
    'confirmed': 0,
    'deaths': 0,
    'recovered': 0,
  }

  limit = 1000;
  countries: string[];
  dates: string[];

  showCountries: any;
  searchCountry = '';
  selectedDate = '';
  isHistory = false;
  constructor(
    private apiService: APIService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.loadLiveData();
    this.loadHistoricalData();
    this.dates = ['Today', '2021-06-18', '2021-06-17', '2021-06-16', '2021-06-15', '2021-06-14', '2021-06-13', '2021-06-12'];
    this.selectedDate = this.dates[0];
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth() < 10}-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay() < 10}`;
  }

  loadLiveData() {
    this.data.live = this.storageService.get(KEY_LIVE_CASES);
    if (!this.data.live) {
      this.data.live = this.apiService.fetchLiveCases().subscribe(
        (res) => {
          this.data.live = res.body;
          this.storageService.set(KEY_LIVE_CASES, this.data.live);
          this.countries = Object.keys(this.data.live);
          console.log(this.data.live);
          this.countries.forEach(name => {
            this.stat.confirmed += this.data.live[name]['All']['confirmed'];
            this.stat.recovered += this.data.live[name]['All']['recovered'];
            this.stat.deaths += this.data.live[name]['All']['deaths'];
          });
          console.log('stat ', this.stat);
        },
        (err) => {
          console.log('Fetching live data error: ', err);
        }
      );
    } else {
      console.log(this.data.live);
      this.countries = Object.keys(this.data.live);
      this.countries.forEach(name => {
        this.stat.confirmed += this.data.live[name]['All']['confirmed'];
        this.stat.recovered += this.data.live[name]['All']['recovered'];
        this.stat.deaths += this.data.live[name]['All']['deaths'];
      });
      this.showCountries = this.countries.slice(0, this.limit);
      console.log('stat ', this.stat);
    }
  }

  loadHistoricalData() {
    const queryParams = {
      status: 'deaths'
    }

    this.data.historyDeaths = this.storageService.get(KEY_HISTORY_DEATHS);
    if (!this.data.historyDeaths) {
      this.data.historyDeaths = this.apiService.fetchHistoricalCases(queryParams).subscribe(
        (res) => {
          this.data.historyDeaths = res.body;
          this.storageService.set(KEY_HISTORY_DEATHS, this.data.historyDeaths);
        },
        (err) => {
          console.log('Fetching live data error: ', err);
        }
      );
    }

    queryParams.status = 'confirmed';
    this.data.historyConfirmed = this.storageService.get(KEY_HISTORY_CONFIRMED);
    console.log('history confirm ', this.data.historyConfirmed);
    if (!this.data.historyConfirmed) {
      this.data.historyConfirmed = this.apiService.fetchHistoricalCases(queryParams).subscribe(
        (res) => {
          this.data.historyConfirmed = res.body;
          this.storageService.set(KEY_HISTORY_CONFIRMED, this.data.historyConfirmed);
        },
        (err) => {
          console.log('Fetching live data error: ', err);
        }
      );
    }
  }

  onSearch(event) {
    // console.log(event, this.searchCountry);
    if (event.keyCode != 13) {
      return;
    }
    this.showCountries = this.countries.filter(name => name.toLowerCase().includes(this.searchCountry.toLowerCase()));
    // console.log(this.showCountries);
  }

  onFilterDate(event) {
    console.log('event', event, this.selectedDate);
    if (this.selectedDate === 'Today') {
      this.isHistory = false;
    } else {
      this.isHistory = true;
    }
  }
}
