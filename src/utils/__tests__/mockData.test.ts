import { MOCK_QUESTIONS, MOCK_PAPERS, CATEGORIES, getQuestionCount } from '../mockData';

// ─── MOCK_QUESTIONS integrity ─────────────────────────────────────────────────

describe('MOCK_QUESTIONS', () => {
  const allPaperIds = Object.keys(MOCK_QUESTIONS);

  it('is defined and non-empty', () => {
    expect(MOCK_QUESTIONS).toBeDefined();
    expect(allPaperIds.length).toBeGreaterThan(0);
  });

  it('has no duplicate question IDs within any paper', () => {
    for (const paperId of allPaperIds) {
      const questions = MOCK_QUESTIONS[paperId];
      const ids = questions.map(q => q.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(
        ids.length,
        `Paper "${paperId}" has duplicate question IDs: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`
      );
    }
  });

  it('has no duplicate question IDs across all papers', () => {
    const allIds: string[] = [];
    for (const paperId of allPaperIds) {
      allIds.push(...MOCK_QUESTIONS[paperId].map(q => q.id));
    }
    const unique = new Set(allIds);
    const duplicates = allIds.filter((id, i) => allIds.indexOf(id) !== i);
    expect(unique.size).toBe(allIds.length, `Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);
  });

  it('every question has all required fields', () => {
    for (const paperId of allPaperIds) {
      for (const question of MOCK_QUESTIONS[paperId]) {
        expect(typeof question.id).toBe('string', `Paper ${paperId}: question missing id`);
        expect(question.id.length).toBeGreaterThan(0);
        expect(typeof question.question).toBe('string', `Paper ${paperId} q${question.id}: missing question text`);
        expect(question.question.length).toBeGreaterThan(0);
        expect(Array.isArray(question.options)).toBe(true);
        expect(typeof question.correctAnswer).toBe('number');
      }
    }
  });

  it('every question has at least 2 options', () => {
    for (const paperId of allPaperIds) {
      for (const question of MOCK_QUESTIONS[paperId]) {
        expect(question.options.length).toBeGreaterThanOrEqual(
          2,
          `Paper "${paperId}", question "${question.id}" has fewer than 2 options`
        );
      }
    }
  });

  it('every correctAnswer is a valid index into its options array', () => {
    for (const paperId of allPaperIds) {
      for (const question of MOCK_QUESTIONS[paperId]) {
        expect(question.correctAnswer).toBeGreaterThanOrEqual(
          0,
          `Paper "${paperId}", question "${question.id}": correctAnswer is negative`
        );
        expect(question.correctAnswer).toBeLessThan(
          question.options.length,
          `Paper "${paperId}", question "${question.id}": correctAnswer ${question.correctAnswer} is out of bounds (${question.options.length} options)`
        );
      }
    }
  });

  it('no option strings are empty', () => {
    for (const paperId of allPaperIds) {
      for (const question of MOCK_QUESTIONS[paperId]) {
        for (const option of question.options) {
          expect(typeof option).toBe('string');
          expect(option.trim().length).toBeGreaterThan(
            0,
            `Paper "${paperId}", question "${question.id}" has an empty option`
          );
        }
      }
    }
  });

  it('has questions for all 21 expected papers', () => {
    const expectedIds = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'];
    for (const id of expectedIds) {
      expect(MOCK_QUESTIONS[id]).toBeDefined();
      expect(MOCK_QUESTIONS[id].length).toBeGreaterThan(0);
    }
  });

  // Spot-check the three new grammar papers added in this session
  describe('new grammar papers (19, 20, 21)', () => {
    it('paper 19 (mots de liaison) has 20 questions', () => {
      expect(MOCK_QUESTIONS['19']).toHaveLength(20);
    });

    it('paper 20 (position des adjectifs) has 20 questions', () => {
      expect(MOCK_QUESTIONS['20']).toHaveLength(20);
    });

    it('paper 21 (adverbes) has 20 questions', () => {
      expect(MOCK_QUESTIONS['21']).toHaveLength(20);
    });

    it('paper 19 q3 (ou) has correctAnswer = 1 because options are [et, ou, mais, parce que]', () => {
      const q3 = MOCK_QUESTIONS['19'].find(q => q.id === 'q19_3');
      expect(q3).toBeDefined();
      expect(q3!.options[q3!.correctAnswer]).toBe('ou');
    });
  });
});

// ─── getQuestionCount ─────────────────────────────────────────────────────────

describe('getQuestionCount', () => {
  it('returns the correct count for each paper', () => {
    expect(getQuestionCount('1')).toBe(MOCK_QUESTIONS['1'].length);
    expect(getQuestionCount('19')).toBe(20);
    expect(getQuestionCount('20')).toBe(20);
    expect(getQuestionCount('21')).toBe(20);
  });

  it('returns 0 for an unknown paper ID', () => {
    expect(getQuestionCount('999')).toBe(0);
    expect(getQuestionCount('')).toBe(0);
    expect(getQuestionCount('nonexistent')).toBe(0);
  });
});

// ─── MOCK_PAPERS integrity ────────────────────────────────────────────────────

describe('MOCK_PAPERS', () => {
  it('is defined and non-empty', () => {
    expect(MOCK_PAPERS).toBeDefined();
    expect(MOCK_PAPERS.length).toBeGreaterThan(0);
  });

  it('has no duplicate paper IDs', () => {
    const ids = MOCK_PAPERS.map(p => p.id);
    const unique = new Set(ids);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(unique.size).toBe(ids.length, `Duplicate paper IDs: ${duplicates.join(', ')}`);
  });

  it('every paper has all required fields', () => {
    for (const paper of MOCK_PAPERS) {
      expect(typeof paper.id).toBe('string');
      expect(paper.id.length).toBeGreaterThan(0);
      expect(typeof paper.title).toBe('string');
      expect(paper.title.length).toBeGreaterThan(0);
      expect(typeof paper.description).toBe('string');
      expect(typeof paper.category).toBe('string');
      expect(typeof paper.difficulty).toBe('string');
      expect(typeof paper.duration).toBe('number');
      expect(paper.duration).toBeGreaterThan(0);
      expect(typeof paper.questionsCount).toBe('number');
      expect(paper.questionsCount).toBeGreaterThan(0);
      expect(typeof paper.isPremium).toBe('boolean');
    }
  });

  it('every paper difficulty is one of the valid values', () => {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    for (const paper of MOCK_PAPERS) {
      expect(validDifficulties).toContain(
        paper.difficulty,
        `Paper "${paper.id}" has invalid difficulty: "${paper.difficulty}"`
      );
    }
  });

  it('every paper category is one of the defined CATEGORIES (excluding "Tous")', () => {
    const validCategories = CATEGORIES.filter(c => c !== 'Tous');
    for (const paper of MOCK_PAPERS) {
      expect(validCategories).toContain(
        paper.category,
        `Paper "${paper.id}" has unknown category: "${paper.category}"`
      );
    }
  });

  it('every paper in MOCK_PAPERS has a corresponding entry in MOCK_QUESTIONS', () => {
    for (const paper of MOCK_PAPERS) {
      expect(MOCK_QUESTIONS[paper.id]).toBeDefined();
      expect(MOCK_QUESTIONS[paper.id].length).toBeGreaterThan(
        0,
        `Paper "${paper.id}" (${paper.title}) has no questions in MOCK_QUESTIONS`
      );
    }
  });

  it('includes the three new grammar papers', () => {
    const ids = MOCK_PAPERS.map(p => p.id);
    expect(ids).toContain('19');
    expect(ids).toContain('20');
    expect(ids).toContain('21');
  });

  it('new grammar papers are marked as free (isPremium: false)', () => {
    const paper19 = MOCK_PAPERS.find(p => p.id === '19');
    const paper20 = MOCK_PAPERS.find(p => p.id === '20');
    const paper21 = MOCK_PAPERS.find(p => p.id === '21');
    expect(paper19?.isPremium).toBe(false);
    expect(paper20?.isPremium).toBe(false);
    expect(paper21?.isPremium).toBe(false);
  });
});

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

describe('CATEGORIES', () => {
  it('includes "Tous" as the first entry', () => {
    expect(CATEGORIES[0]).toBe('Tous');
  });

  it('contains all expected categories', () => {
    const expected = [
      'Compréhension Orale',
      'Expression Écrite',
      'Compréhension Écrite',
      'Expression Orale',
      'Vocabulaire et Grammaire',
      'Test Complet',
    ];
    for (const cat of expected) {
      expect(CATEGORIES).toContain(cat);
    }
  });

  it('has no duplicate entries', () => {
    const unique = new Set(CATEGORIES);
    expect(unique.size).toBe(CATEGORIES.length);
  });
});
