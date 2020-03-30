import {Component, OnInit} from '@angular/core';
import { films } from '../constants/films';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public filmsTemp;
  public inputsForm: FormGroup;
  public paginationNumbers = [5, 10, 25];
  public films = films;
  public forGenre: any[];
  public forPremiere: any[];
  public sortName: string | null = null;
  public sortValue: string | null = null;
  private pageIndex: number = 1;
  private pageSize: number = 5;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.inputsForm = this.fb.group({
      genre: [''],
      premiere: [''],
      name: [''],
    });

    this.forGenre = this.uniqueGenre();
    this.forPremiere = this.unique('premiere');

    this.inputsForm.valueChanges
      .subscribe(({ genre, name, premiere }) => {
        this.films = films;
        this.filter(this.films, name, 'name');
        if (premiere) {
          this.filter(this.filmsTemp, premiere, 'premiere');
        }
        if (genre) {
          this.filter(this.filmsTemp, genre, 'genre');
        }
        this.films = this.filmsTemp;
      });
  }

  public filter(list, option, optionName) {
    if (!option) {
      this.filmsTemp = this.films;
      return;
    }
    this.filmsTemp = [];
    list.forEach((film) => {
      if (optionName === 'genre') {
        film.genre.forEach(genre => {
          if (genre.toLocaleLowerCase().includes(option.toLowerCase())) {
            this.filmsTemp.push(film);
          }
        })
      } else {
        if (film[optionName].toLowerCase().includes(option.toLowerCase())) {
          this.filmsTemp.push(film);
        }
      }
    });
  }

  public uniqueGenre() {
    let result = [];
    this.films.forEach(film => {
      film.genre.forEach(genre => {
        if (!result.includes(genre)) {
          result.push(genre);
        }
      })
    });
    return result;
  }

  public unique(value: string) {
    let result = [];
    this.films.forEach(film =>{
      if (!result.includes(film[value])) {
        const resultTemp = value === 'premiere' ? film[value].split('.')[2] : film[value];
        result.push(resultTemp)
      }
    });
    return result;
  }

  public sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    const sortCallback = this.sortFn(this.sortName, this.sortValue);

    if (this.sortName && this.sortValue) {
      this.films = [...this.films.sort((a, b) => sortCallback(a, b))];
    }
  }

  public sortFn = (sortName: string, direction: string) => (a, b) => {
    let firstStr;
    let secondStr;
    if (sortName === 'premiere') {
      firstStr = +a[sortName].split('.')[2];
      secondStr = +b[sortName].split('.')[2];
    } else {
      firstStr = typeof a[sortName] === 'string' ? a[sortName].replace(/\s+/g, '').toLowerCase() : a[sortName];
      secondStr = typeof b[sortName] === 'string' ? b[sortName].replace(/\s+/g, '').toLowerCase() : b[sortName];
    }

    if (direction === 'ascend') {
      return firstStr < secondStr ? 1 : -1;
    }
    return firstStr > secondStr ? 1 : -1;
  };
}
