describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'Enmanuel Sanchez',
      username: 'abarua',
      password: '123456'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
    cy.visit('');
  });

  it('front page can be opened', function () {
    cy.contains('Notes');
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  });

  it('login form can be opened', function () {
    cy.contains('login').click();
  });

  it('user can login', function () {
    cy.contains('login').click();
    cy.get('#username').type('abarua');
    cy.get('#password').type('123456');
    cy.get('#login-button').click();

    cy.contains('Enmanuel Sanchez logged in')
  });

  it('login fails with wrong password', function () {
    cy.contains('login').click();
    cy.get('#username').type('abarua');
    cy.get('#password').type('wrong');
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');

    cy.get('html').should('not.contain', 'Enmanuel Sanchez logged in');
  });



  describe('when logged in', function () {
    describe('and several notes exits', function () {
      beforeEach(function () {
        cy.login({ username: 'abarua', password: '123456' })
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      });

      it('a new note can be created', function () {
        cy.contains('new note').click();
        cy.get('input').type('a note created by cypress');
        cy.contains('save').click();
        cy.contains('a note created by cypress');
      });

      it('one of those can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton');
        cy.get('@theButton').click();
        cy.get('@theButton').should('contain', 'make not important');
      })

    })
  })
})