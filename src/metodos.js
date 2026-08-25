/**
 * Classe Escola
 * Simula um sistema de gestão escolar (alunos, notas, matrículas, turmas).
 * Métodos puros (sem efeitos colaterais), fáceis de testar com Jest, Mocha, Vitest, etc.
 */
class Escola {
  // ---------- NOTAS E DESEMPENHO ----------
 
  /** Calcula a média simples de um array de notas */
  calculaMedia(notas) {
    if (!notas || notas.length === 0) {
      throw new Error('Lista de notas não pode ser vazia');
    }
    return notas.reduce((acc, n) => acc + n, 0) / notas.length;
  }
 
  /** Calcula a média ponderada: notas e pesos devem ter o mesmo tamanho */
  calculaMediaPonderada(notas, pesos) {
    if (!notas || !pesos || notas.length !== pesos.length || notas.length === 0) {
      throw new Error('Notas e pesos devem ter o mesmo tamanho e não podem ser vazios');
    }
    const somaPesos = pesos.reduce((acc, p) => acc + p, 0);
    const somaPonderada = notas.reduce((acc, n, i) => acc + n * pesos[i], 0);
    return somaPonderada / somaPesos;
  }
 
  /** Verifica se o aluno foi aprovado (média >= 6) */
  ehAprovado(media) {
    return media >= 6;
  }
 
  /** Verifica se o aluno está de recuperação (média entre 4 e 5.9) */
  estaDeRecuperacao(media) {
    return media >= 4 && media < 6;
  }
 
  /** Verifica se o aluno está reprovado (média < 4) */
  ehReprovado(media) {
    return media < 4;
  }
 
  /** Retorna o conceito (A, B, C, D, F) a partir de uma nota de 0 a 10 */
  calculaConceito(nota) {
    if (nota < 0 || nota > 10) {
      throw new Error('Nota deve estar entre 0 e 10');
    }
    if (nota >= 9) return 'A';
    if (nota >= 7) return 'B';
    if (nota >= 6) return 'C';
    if (nota >= 4) return 'D';
    return 'F';
  }
 
  /** Retorna a nota mais alta de uma turma */
  maiorNota(notas) {
    if (!notas || notas.length === 0) {
      throw new Error('Lista de notas não pode ser vazia');
    }
    return Math.max(...notas);
  }
 
  /** Retorna a nota mais baixa de uma turma */
  menorNota(notas) {
    if (!notas || notas.length === 0) {
      throw new Error('Lista de notas não pode ser vazia');
    }
    return Math.min(...notas);
  }
 
  // ---------- FREQUÊNCIA ----------
 
  /** Calcula o percentual de frequência (presenças / total de aulas) */
  calculaFrequencia(presencas, totalAulas) {
    if (totalAulas <= 0) {
      throw new Error('Total de aulas deve ser maior que zero');
    }
    return (presencas / totalAulas) * 100;
  }
 
  /** Verifica se o aluno atingiu a frequência mínima exigida (75%) */
  atingiuFrequenciaMinima(percentualFrequencia) {
    return percentualFrequencia >= 75;
  }
 
  /** Calcula quantas faltas o aluno pode ter sem perder a frequência mínima */
  faltasPermitidas(totalAulas, percentualMinimo = 75) {
    if (totalAulas <= 0) {
      throw new Error('Total de aulas deve ser maior que zero');
    }
    const presencasMinimas = Math.ceil((percentualMinimo / 100) * totalAulas);
    return totalAulas - presencasMinimas;
  }
 
  // ---------- MATRÍCULA E TURMA ----------
 
  /** Verifica se o aluno tem idade mínima para se matricular (padrão: 6 anos) */
  ehIdadeValidaParaMatricula(idade, idadeMinima = 6) {
    return idade >= idadeMinima;
  }
 
  /** Verifica se ainda há vagas na turma */
  temVagaDisponivel(alunosMatriculados, capacidadeMaxima) {
    return alunosMatriculados < capacidadeMaxima;
  }
 
  /** Calcula quantas vagas restam em uma turma */
  vagasRestantes(alunosMatriculados, capacidadeMaxima) {
    const restantes = capacidadeMaxima - alunosMatriculados;
    return restantes > 0 ? restantes : 0;
  }
 
  /** Gera uma matrícula no formato ANO-SEQUENCIAL (ex: 2026-00042) */
  geraMatricula(ano, sequencial) {
    if (sequencial < 0) {
      throw new Error('Sequencial não pode ser negativo');
    }
    return `${ano}-${String(sequencial).padStart(5, '0')}`;
  }
 
  /** Valida se um CPF de responsável tem formato numérico de 11 dígitos (validação simples de formato) */
  ehFormatoCpfValido(cpf) {
    const limpo = String(cpf).replace(/\D/g, '');
    return limpo.length === 11;
  }
 
  // ---------- TURMAS E RELATÓRIOS ----------
 
  /** Agrupa uma lista de alunos (objetos com propriedade turma) por turma */
  agrupaPorTurma(alunos) {
    return alunos.reduce((grupos, aluno) => {
      const turma = aluno.turma;
      if (!grupos[turma]) grupos[turma] = [];
      grupos[turma].push(aluno);
      return grupos;
    }, {});
  }
 
  /** Filtra alunos aprovados a partir de uma lista de objetos { nome, media } */
  filtraAprovados(alunos) {
    return alunos.filter((aluno) => this.ehAprovado(aluno.media));
  }
 
  /** Calcula a média geral da turma a partir de uma lista de objetos { media } */
  mediaGeralTurma(alunos) {
    if (!alunos || alunos.length === 0) {
      throw new Error('Lista de alunos não pode ser vazia');
    }
    const medias = alunos.map((aluno) => aluno.media);
    return this.calculaMedia(medias);
  }
 
  /** Ordena alunos por média, do maior para o menor (ranking) */
  ordenaPorRanking(alunos) {
    return [...alunos].sort((a, b) => b.media - a.media);
  }
 
  /** Normaliza o nome do aluno: capitaliza cada palavra e remove espaços extras */
  normalizaNomeAluno(nome) {
    return nome
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  }
}
 
module.exports = Escola;