import { inject, Injectable,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root',
})
export class TopicService {

  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/topics';

  public topicsList = signal<Topic[]>([]);

  public loadTopics(): void {
    this.http.get<Topic[]>(this.apiUrl).subscribe({
      next: (topics) =>{
        this.topicsList.set(topics);
        console.log(topics);
      },
      error:(error) =>{
        console.log("Erro: ",error);
      }
    });
  }

  public addTopic(topic: Topic):void {
    this.http.post<Topic>(this.apiUrl,topic).subscribe({
      next:(topicInserted: Topic) => {
        this.topicsList.update(topicsList => [...topicsList, topicInserted]);
      },
      error:(error)=> {
        console.log("Erro: ", error);
      }
    })
  }
}
