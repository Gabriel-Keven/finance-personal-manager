import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators, FormGroupDirective } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Service
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-topic-form',
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './topic-form.html',
  styleUrl: './topic-form.scss',
})
export class TopicForm implements OnInit {

  @ViewChild('formDiretiva') formDiretiva!: FormGroupDirective;

  private topicService = inject(TopicService);
  private snackBar = inject(MatSnackBar);
  
  topicoSelecionado = this.topicService.topicSeletected();

  topic = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });

  ngOnInit(): void {    
    if (this.topicoSelecionado !== null) {
      this.topic.patchValue({
        name: this.topicoSelecionado.name
      });
    }
  }  
  
  onSubmit(): void {
    if (this.topic.invalid) {
      return;
    }
    const nomeDigitado = this.topic.value.name || '';

    if (this.topicoSelecionado !== null && this.topicoSelecionado.idTopics) {
      
      const updateTopic: Topic = {
        idTopics: this.topicoSelecionado.idTopics,
        name: nomeDigitado
      };

      this.topicService.updateTopic(updateTopic.idTopics!, updateTopic).subscribe({
        next: () => {
          this.exibirNotificacao('Tópico atualizado com sucesso!');
          this.limparFormulario();
        },
        error: () => {
          this.exibirNotificacao('Erro ao atualizar o tópico!');
        }
      });

    } else {
      const newTopic: Topic = {
        name: nomeDigitado
      };

      this.topicService.addTopic(newTopic).subscribe({
        next: () => {
          this.exibirNotificacao('Tópico inserido com sucesso!');
          this.limparFormulario();
        },
        error: () => {
          this.exibirNotificacao('Erro ao inserir o tópico!');
        }
      });
    }
  }

  // --- Funções Auxiliares para manter o código limpo ---

  private exibirNotificacao(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private limparFormulario(): void {
    this.topic.reset(); // Zera os valores
    this.formDiretiva.resetForm(); // Limpa os erros visuais vermelhos da tela
    this.topicService.topicSeletected.set(null); // Esvazia o cofre de edição
  }
}