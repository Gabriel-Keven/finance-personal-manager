import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../models/topic.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopicService {

  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/topics';

  public topicsList = signal<Topic[]>([]);

  public topicSeletected = signal<Topic | null>(null);

public loadTopics(): Observable<Topic[]> {
      return this.http.get<Topic[]>(this.apiUrl).pipe(
        // A MÁGICA: Salva o resultado do banco de dados no Sinal
        tap(topics => this.topicsList.set(topics))
      );
  }
  public addTopic(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>(this.apiUrl, topic).pipe(
      tap({
        next: (topicUpdate: Topic) => {
          this.topicsList.update(topicsList => [...topicsList, topicUpdate]);
        },
        error: (error) => {
          console.error("Erro ao inserir o tópico: ", error);
        },
      })
    );
  }

  public deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe();
  }
  public updateTopic(id: number, topic: Topic): Observable<Topic> {
    return this.http.put<Topic>(`${this.apiUrl}/${id}`, topic).pipe(
      tap({
        next: (topicUpdate: Topic) => {
          this.topicsList.update(topicsList => 
            topicsList.map(t => t.idTopics === id ? topicUpdate : t)
          );
        },
        error: (error) => {
          console.error("Erro ao atualizar o tópico: ", error);
        },
      })
    );
  }
}
