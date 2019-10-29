import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// components
import Board from './Components/Board'
import IssuesInTime from './views/IssuesInTime'
import Labels from './views/Labels'
import TopUsers from './views/TopUsers'

// styled components
import styled, { ThemeProvider } from "styled-components"
import theme from "./theme/";
import "./theme/baseline.css";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 32px;
  padding-right: 32px;
  max-width: 1280px;
  margin: auto;
`

const Box = styled.div`
  display: flex;
  flex: 1;
  border-radius: 5px;
  background: white;
  height: 100vh
  flex-direction: column;
  white-space: pre-line;
  padding: 5px;
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box>
          <Board/>
          <Router>
						<div>
							<nav>
								<ul>
									<li>
										<Link to="/">Home</Link>
									</li>
									<li>
										<Link to="/labels">Labels</Link>
									</li>
									<li>
										<Link to="/issues">Issues</Link>
									</li>
									<li>
										<Link to="/top-users">Top Users</Link>
									</li>
								</ul>
							</nav>
							<Switch>
								<Route exact path="/">
									<code>
										{`
              À l’aide de l’API github, vous devrez réaliser une datavisualisation sur les issues du repository microsoft/vscode, à partir d’une base de projet que nous vous aurons fourni.

              Chaque point listé au dessus devra être sur un onglet/composant indépendant accessible via une route
              Comme dit dans le point précédant, l’application devra implémenter un react router.

              Vous aurez carte blanche sur le design du projet ! N'hésitez pas à tout modifier.

              Une fois terminé vous devrez héberger votre réalisation sur un repository github et nous envoyer son lien. Toute fonctionnalité supplémentaire est la bienvenue. Nous vous laissons une semaine pour nous renvoyer le test.
            `}
									</code>
								</Route>
								<Route path="/labels">
									<Labels />
								</Route>
								<Route path="/issues">
									<IssuesInTime />
								</Route>
								<Route path="/top-users">
									<TopUsers />
								</Route>
							</Switch>
						</div>
					</Router>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
