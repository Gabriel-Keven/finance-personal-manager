import { Component, inject,OnInit,signal } from '@angular/core';
import { Topic } from '../../models/topic.model';
import { firstValueFrom } from 'rxjs';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { TopicService } from '../../services/topic.service';

@Component({
  selector: 'app-topic-list',
  imports: [MatTableModule, MatCardModule, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.scss',
})
export class TopicList implements OnInit {
  private topicService = inject(TopicService);

  
  public topics = signal<Topic[]>([]);

  private snackBar = inject(MatSnackBar);

  private router = inject(Router);

  public displayedColumns: string[] = [
    'idTopics',
    'name',
    'actions'
  ];

  ngOnInit(): void {
    this.loadTopics();
    this.topicService.topicSeletected.set(null);
  }

  public async loadTopics() {
      try {
        const dados = await firstValueFrom(this.topicService.loadTopics());
        this.topics.set(dados);
      } catch (erro) {
        console.error('Falha ao buscar os tópicos:', erro);
      }
    }
  
    async deleteTopic(id: number) {
  
      try {
        const result = await firstValueFrom(this.topicService.deleteTopic(id));
  
        this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', {
          duration: 3000, // Some sozinha após 3 segundos
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        const topicsAfterDelete = this.topics().filter((topic) => topic.idTopics != id);
        this.topics.set(topicsAfterDelete);
      } catch (error) {
        this.snackBar.open('Erro ao excluir a despesa', 'Fechar', {
          duration: 3000, // Some sozinha após 3 segundos
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
  
      }
    }
  
    editTopic(topic: Topic) {
      this.topicService.topicSeletected.set(topic);
      this.router.navigate(['/cadastrar-topicos']);
    }
}
