describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', 'http://192.168.100.26:3001/api/testing/reset');
    const user = {
      name: 'Enmanuel Sanchez',
      username: 'abarua',
      password: '123456'
    }
    cy.request('POST', 'http://192.168.100.26:3001/api/users', user);
    cy.visit('http://192.168.100.26:5173/');
  });

  it('Login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('it succeeds with correct credentials', function () {
      cy.get('#username').type('abarua');
      cy.get('#password').type('123456');
      cy.get('#login-button').click();

      cy.contains('Enmanuel Sanchez logged in');
    });

    it('it fails with wrong credentials', function () {
      cy.get('#username').type('abarua');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(203, 0, 0)');

      cy.get('html').should('not.contain', 'Enmanuel Sanchez logged in');
    });
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'abarua', password: '123456' });
    });

    it('a blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('a blog created by cypress');
      cy.get('#author').type('a blog author by cypress');
      cy.get('#url').type('a blog url by cypress');

      cy.get('#create-blog-button').click();

      cy.contains('a blog created by cypress');
      cy.contains('a blog author by cypress');
    });

    it('a user can like a blog', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('a blog created by cypress');
      cy.get('#author').type('a blog author by cypress');
      cy.get('#url').type('a blog url by cypress');

      cy.get('#create-blog-button').click();

      cy.contains('view').click();
      cy.contains('likes 0');

      cy.get('#like-button').click();
      cy.contains('likes 1');
    });

    describe('and several blogs from different user exits', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'a blog created by cypress', author: 'a blog author by cypress', url: 'a blog url by cypress' })
        cy.contains('log out').click();

        const user = {
          name: 'Secondary User',
          username: 'secuser',
          password: 'abalo'
        }
        cy.request('POST', 'http://192.168.100.26:3001/api/users', user);
        cy.visit('http://192.168.100.26:5173/');

        cy.login({ username: 'secuser', password: 'abalo' });
        cy.createBlog({ title: 'a blog created by cypress 2', author: 'a blog author by cypress 2', url: 'a blog url by cypress 2' })

      });

      it('a user can delete its own blog', function () {

        cy.get('button:last').click();

        cy.contains('remove').click();

        cy.get('html')
          .should('not.contain', 'a blog created by cypress 2')
          .and('not.contain', 'a blog author by cypress 2')

        cy.contains('a blog created by cypress');

        cy.contains('view').click();

        cy.contains('remove').should('not.exist');
      });

    });

    describe('and several blogs with likes exits', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first author', url: 'first url' })
        cy.createBlog({ title: 'second blog', author: 'second author', url: 'second url' })
        cy.createBlog({ title: 'third blog', author: 'third author', url: 'third url' })

        cy
          .contains('first blog')
          .contains('view')
          .click()
          .get('#like-button')
          .click();

        cy.contains('hide').click();

        cy
          .contains('second blog')
          .contains('view')
          .click()
          .get('#like-button')
          .click();

        cy.contains('hide').click();

        cy
          .contains('second blog')
          .contains('view')
          .click()
          .get('#like-button')
          .click();
      });

      it('blogs are sorted by likes', function () {
        cy.get('.blog').eq(0).should('contain', 'second blog')
        cy.get('.blog').eq(1).should('contain', 'first blog')
        cy.get('.blog').eq(2).should('contain', 'third blog')
      });

    });
  });

});