import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];
  private apiKey: string = 'gWCb7hBAduBADwXpByPi3TCYiv3B2gi4';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs service ready');
    
  }

  get tagHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this.tagHistory.includes(tag)) {
      //elimina si el tag es repetido
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag); //vuelve a meter el tag
    this._tagsHistory = this.tagHistory.splice(0, 10); //limita a 10 resultados
    this.saveLocalStorage();
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this.tagHistory));
  }

  public searchTag(tag: string): void {
    if (tag.length === 0) return; //Si está vacio, no añade el valor
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}