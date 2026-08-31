const Escola = require("../src/metodos");

describe("Escola", () => {
  let escola;

  beforeEach(() => {
    escola = new Escola();
  });

  // ===== NOTAS E DESEMPENHO =====

  describe("calculaMedia", () => {
    test("calcula a media simples de varias notas", () => {
      expect(escola.calculaMedia([6, 7, 8])).toBe(7);
    });
    test("com uma unica nota retorna a propria nota", () => {
      expect(escola.calculaMedia([9.5])).toBe(9.5);
    });
    test("lanca erro quando a lista esta vazia", () => {
      expect(() => escola.calculaMedia([])).toThrow("nao pode ser vazia");
    });
    test("lanca erro quando o argumento e null", () => {
      expect(() => escola.calculaMedia(null)).toThrow();
    });
  });

  describe("calculaMediaPonderada", () => {
    test("calcula a media ponderada com notas e pesos", () => {
      // (8*3 + 6*1) / (3+1) = 30 / 4 = 7.5
      expect(escola.calculaMediaPonderada([8, 6], [3, 1])).toBe(7.5);
    });
    test("erro quando notas e pesos tem tamanhos diferentes", () => {
      expect(() => escola.calculaMediaPonderada([8, 6], [1])).toThrow();
    });
    test("erro quando as listas estao vazias", () => {
      expect(() => escola.calculaMediaPonderada([], [])).toThrow();
    });
    test("erro quando pesos e null", () => {
      expect(() => escola.calculaMediaPonderada([8], null)).toThrow();
    });
  });

  describe("ehAprovado", () => {
    test.each([
      [5.99, false],
      [6, true],
      [7.5, true],
    ])("media %p -> aprovado? %p", (media, esperado) => {
      expect(escola.ehAprovado(media)).toBe(esperado);
    });
  });

  describe("estaDeRecuperacao", () => {
    test.each([
      [3.99, false],
      [4, true],
      [5.99, true],
      [6, false],
    ])("media %p -> recuperacao? %p", (media, esperado) => {
      expect(escola.estaDeRecuperacao(media)).toBe(esperado);
    });
  });

  describe("ehReprovado", () => {
    test("media abaixo de 4 esta reprovado", () => {
      expect(escola.ehReprovado(3.9)).toBe(true);
    });
    test("media igual a 4 nao esta reprovado", () => {
      expect(escola.ehReprovado(4)).toBe(false);
    });
  });

  describe("calculaConceito", () => {
    test.each([
      [10, "A"], [9, "A"], [8.9, "B"], [7, "B"], [6, "C"],
      [5.9, "D"], [4, "D"], [3.9, "F"], [0, "F"],
    ])("nota %p -> conceito %s", (nota, esperado) => {
      expect(escola.calculaConceito(nota)).toBe(esperado);
    });
    test("erro para nota abaixo de 0", () => {
      expect(() => escola.calculaConceito(-1)).toThrow("entre 0 e 10");
    });
    test("erro para nota acima de 10", () => {
      expect(() => escola.calculaConceito(11)).toThrow("entre 0 e 10");
    });
  });

  describe("maiorNota e menorNota", () => {
    test("maiorNota retorna o maximo do array", () => {
      expect(escola.maiorNota([4, 9, 7])).toBe(9);
    });
    test("menorNota retorna o minimo do array", () => {
      expect(escola.menorNota([4, 9, 7])).toBe(4);
    });
    test("maiorNota lanca erro com lista vazia", () => {
      expect(() => escola.maiorNota([])).toThrow();
    });
    test("menorNota lanca erro quando recebe null", () => {
      expect(() => escola.menorNota(null)).toThrow();
    });
  });

  // ===== FREQUENCIA =====

  describe("calculaFrequencia", () => {
    test("calcula o percentual de presenca", () => {
      expect(escola.calculaFrequencia(18, 20)).toBe(90);
    });
    test("erro quando o total de aulas e zero", () => {
      expect(() => escola.calculaFrequencia(10, 0)).toThrow("maior que zero");
    });
    test("erro quando o total de aulas e negativo", () => {
      expect(() => escola.calculaFrequencia(10, -5)).toThrow();
    });
  });

  describe("atingiuFrequenciaMinima", () => {
    test("74.9% nao atinge o minimo", () => {
      expect(escola.atingiuFrequenciaMinima(74.9)).toBe(false);
    });
    test("75% atinge o minimo (valor-limite)", () => {
      expect(escola.atingiuFrequenciaMinima(75)).toBe(true);
    });
  });

  describe("faltasPermitidas", () => {
    test("em 20 aulas com 75% pode faltar 5", () => {
      expect(escola.faltasPermitidas(20)).toBe(5);
    });
    test("em 10 aulas com 75% pode faltar 2", () => {
      expect(escola.faltasPermitidas(10)).toBe(2);
    });
    test("aceita um percentual minimo customizado", () => {
      expect(escola.faltasPermitidas(20, 50)).toBe(10);
    });
    test("erro quando o total de aulas e invalido", () => {
      expect(() => escola.faltasPermitidas(0)).toThrow();
    });
  });
 // ===== MATRICULA E TURMA =====

  describe("ehIdadeValidaParaMatricula", () => {
    test("5 anos nao pode matricular (padrao 6)", () => {
      expect(escola.ehIdadeValidaParaMatricula(5)).toBe(false);
    });
    test("6 anos pode matricular (valor-limite)", () => {
      expect(escola.ehIdadeValidaParaMatricula(6)).toBe(true);
    });
    test("respeita uma idade minima customizada", () => {
      expect(escola.ehIdadeValidaParaMatricula(14, 15)).toBe(false);
    });
  });

  describe("temVagaDisponivel", () => {
    test("ha vaga quando matriculados < capacidade", () => {
      expect(escola.temVagaDisponivel(29, 30)).toBe(true);
    });
    test("nao ha vaga quando matriculados = capacidade", () => {
      expect(escola.temVagaDisponivel(30, 30)).toBe(false);
    });
  });

  describe("vagasRestantes", () => {
    test("retorna quantas vagas sobraram", () => {
      expect(escola.vagasRestantes(25, 30)).toBe(5);
    });
    test("retorna 0 quando a turma esta exatamente cheia", () => {
      expect(escola.vagasRestantes(30, 30)).toBe(0);
    });
    test("nunca retorna negativo (turma superlotada)", () => {
      expect(escola.vagasRestantes(35, 30)).toBe(0);
    });
  });

  describe("geraMatricula", () => {
    test("formata como ANO-SEQUENCIAL com 5 digitos", () => {
      expect(escola.geraMatricula(2026, 42)).toBe("2026-00042");
    });
    test("erro quando o sequencial e negativo", () => {
      expect(() => escola.geraMatricula(2026, -1)).toThrow("negativo");
    });
  });

  describe("ehFormatoCpfValido", () => {
    test("aceita cpf com pontuacao (11 digitos)", () => {
      expect(escola.ehFormatoCpfValido("123.456.789-01")).toBe(true);
    });
    test("aceita 11 digitos sem pontuacao", () => {
      expect(escola.ehFormatoCpfValido("12345678901")).toBe(true);
    });
    test("rejeita quando nao tem 11 digitos", () => {
      expect(escola.ehFormatoCpfValido("123")).toBe(false);
    });
  });

  // ===== TURMAS E RELATORIOS =====

  describe("agrupaPorTurma", () => {
    test("agrupa os alunos pela propriedade turma", () => {
      const alunos = [
        { nome: "Ana", turma: "1A" },
        { nome: "Bia", turma: "1A" },
        { nome: "Caio", turma: "2B" },
      ];
      expect(escola.agrupaPorTurma(alunos)).toEqual({
        "1A": [
          { nome: "Ana", turma: "1A" },
          { nome: "Bia", turma: "1A" },
        ],
        "2B": [{ nome: "Caio", turma: "2B" }],
      });
    });
    test("retorna objeto vazio para lista vazia", () => {
      expect(escola.agrupaPorTurma([])).toEqual({});
    });
  });

  describe("filtraAprovados", () => {
    test("mantem apenas alunos com media >= 6", () => {
      const alunos = [
        { nome: "Ana", media: 8 },
        { nome: "Bia", media: 5 },
        { nome: "Caio", media: 6 },
      ];
      expect(escola.filtraAprovados(alunos)).toEqual([
        { nome: "Ana", media: 8 },
        { nome: "Caio", media: 6 },
      ]);
    });
  });

  describe("mediaGeralTurma", () => {
    test("calcula a media das medias dos alunos", () => {
      const alunos = [{ media: 6 }, { media: 8 }, { media: 10 }];
      expect(escola.mediaGeralTurma(alunos)).toBe(8);
    });
    test("erro quando nao ha alunos", () => {
      expect(() => escola.mediaGeralTurma([])).toThrow();
    });
  });

  describe("ordenaPorRanking", () => {
    test("ordena do maior para o menor por media", () => {
      const alunos = [
        { nome: "Ana", media: 5 },
        { nome: "Bia", media: 9 },
        { nome: "Caio", media: 7 },
      ];
      const ranking = escola.ordenaPorRanking(alunos);
      expect(ranking.map((a) => a.nome)).toEqual(["Bia", "Caio", "Ana"]);
    });
    test("nao modifica o array original", () => {
      const alunos = [
        { nome: "Ana", media: 5 },
        { nome: "Bia", media: 9 },
      ];
      escola.ordenaPorRanking(alunos);
      expect(alunos[0].nome).toBe("Ana");
    });
  });

  describe("normalizaNomeAluno", () => {
    test("capitaliza cada palavra e remove espacos extras", () => {
      expect(escola.normalizaNomeAluno("  maria   DA silva ")).toBe("Maria Da Silva");
    });
    test("uma palavra toda em maiuscula vira capitalizada", () => {
      expect(escola.normalizaNomeAluno("JOAO")).toBe("Joao");
    });
  });
});
  