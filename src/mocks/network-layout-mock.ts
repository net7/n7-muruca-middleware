export const NETWORK_MOCK = {
  containerID: 'demo-network',
  nodes: [
    { id: 1, label: 'Girolamo Zavattari', group: 'Fulmine', payload: 'https://adalgisa.muruca.cloud/character/65/girolamo-zavattari' },
    { id: 2, label: 'Pietro e Luigi Borlotti', group: 'Fulmine', payload: {
      link: {
        routeId: 'networkItem',
        id: 2,
        slug: 'pietro-e-luigi-borlotti',
        
      }
    } },
    { id: 3, label: 'avvocato Cazzuola', group: 'Fulmine' },
    { id: 4, label: 'Elsa Delmonte', group: 'Fulmine' },
    { id: 5, label: 'Maria', group: 'Fulmine' },
    { id: 6, label: 'Bruno Locati', group: 'Fulmine' },
    { id: 7, label: 'Felice Testori', group: 'Fulmine' },
    { id: 8, label: 'Gian Maria Cavenaghi/Caviggioni', group: 'Fulmine' },
    { id: 9, label: 'Doralice', group: 'Altro (Claudio)' },
    { id: 10, label: 'Claudio Valeri', group: 'Altro (Claudio)' },
    { id: 11, label: 'donna Carla', group: 'Altro (Claudio)' },
    { id: 12, label: 'Antenore', group: 'Altro (Claudio)' },
    { id: 13, label: 'cav. Bertoloni', group: 'Cognizione' },
    { id: 14, label: 'Carlos Caçoncellos', group: 'Cognizione' },
    { id: 15, label: 'Giuseppina', group: 'Cognizione' },
    { id: 16, label: 'colonnello medico Di Pascuale', group: 'Cognizione' },
    { id: 17, label: 'dottore', group: 'Cognizione' },
    { id: 18, label: 'José/Giuseppe', group: 'Cognizione' },
    { id: 19, label: 'figlio/Gonzalo', group: 'Cognizione' },
    { id: 20, label: 'mamma/Signora', group: 'Cognizione' }
  ],
  edges: [
    // Relazioni di Girolamo Zavattari (1)
    { id: 1, from: 1, to: 2, label: 'lavoro (dipendente di)' },
    { id: 2, from: 1, to: 4, label: 'lavoro (dipendente di)' },
    { id: 3, from: 1, to: 8, label: 'lavoro (dipendente di)' },
    
    // Relazioni di Pietro e Luigi Borlotti (2)
    { id: 4, from: 2, to: 1, label: 'lavoro (datore di lavoro di)' },
    
    // Relazioni di avvocato Cazzuola (3)
    { id: 5, from: 3, to: 2, label: 'lavoro' },
    
    // Relazioni di Elsa Delmonte (4)
    { id: 6, from: 4, to: 1, label: 'lavoro (datrice di lavoro di)' },
    { id: 7, from: 4, to: 8, label: 'famiglia (matrimonio con)' },
    { id: 8, from: 4, to: 6, label: 'relazione amorosa' },
    
    // Relazioni di Maria (5)
    { id: 9, from: 5, to: 4, label: 'lavoro (dipendente di)' },
    { id: 10, from: 5, to: 8, label: 'lavoro (dipendente di)' },
    
    // Relazioni di Bruno Locati (6)
    { id: 11, from: 6, to: 7, label: 'lavoro (dipendente di)' },
    { id: 12, from: 6, to: 8, label: 'lavoro (dipendente di)' },
    
    // Relazioni di Felice Testori (7)
    { id: 13, from: 7, to: 7, label: 'lavoro (datore di lavoro di)' },
    
    // Relazioni di Gian Maria Cavenaghi/Caviggioni (8)
    { id: 14, from: 8, to: 1, label: 'lavoro (datore di lavoro di)' },
    { id: 15, from: 8, to: 4, label: 'famiglia (matrimonio con)' },
    { id: 16, from: 8, to: 5, label: 'lavoro (datore di lavoro di)' },
    { id: 17, from: 8, to: 6, label: 'lavoro (datore di lavoro di)' },
    
    // Relazioni di Doralice (9)
    { id: 18, from: 9, to: 10, label: 'relazione amorosa' },
    
    // Relazioni di Claudio Valeri (10)
    { id: 19, from: 10, to: 9, label: 'relazione amorosa' },
    
    // Relazioni di donna Carla (11)
    { id: 20, from: 11, to: 9, label: 'famiglia (zia di)' },
    
    // Relazioni di Antenore (12)
    { id: 21, from: 12, to: 9, label: 'famiglia (zio di)' },
    
    // Relazioni di cav. Bertoloni (13)
    { id: 22, from: 13, to: 14, label: 'proprietario di casa di' },
    { id: 23, from: 13, to: 16, label: 'proprietario di casa di' },
    
    // Relazioni di Carlos Caçoncellos (14)
    { id: 24, from: 14, to: 13, label: 'affittuario di' },
    
    // Relazioni di Giuseppina (15)
    { id: 25, from: 15, to: 14, label: 'lavoro (dipendente di)' },
    
    // Relazioni di colonnello medico Di Pascuale (16)
    { id: 26, from: 16, to: 13, label: 'affittuario di' },
    
    // Relazioni di dottore (17)
    { id: 27, from: 17, to: 19, label: 'medico di' },
    
    // Relazioni di José/Giuseppe (18)
    { id: 28, from: 18, to: 19, label: 'lavoro (dipendente di)' },
    { id: 29, from: 18, to: 20, label: 'lavoro (dipendente di)' },
    
    // Relazioni di figlio/Gonzalo (19)
    { id: 30, from: 19, to: 20, label: 'famiglia (figlio di)' },
    
    // Relazioni di mamma/Signora (20)
    { id: 31, from: 20, to: 19, label: 'famiglia (madre di)' }
  ],
  libOptions: {
    nodes: {
      shape: 'dot',
      size: 40,
      font: {
        size: 14,
        color: '#333333'
      }
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1.2 }
      },
      width: 1,
      font: {
        size: 10,
        align: 'middle',
        color: '#333333'
      },
      color: {
        color: '#666666',
        highlight: '#333333'
      }
    },
    groups: {
      'Fulmine': { 
        color: '#fff2cc',
        shape: "icon",
        icon: {
          face: "'Arial Unicode MS'",
          code: "☻",
          size: 40,
          color: "#fff2cc",
        }
      },
      'Altro (Claudio)': { 
        color: '#ead1dc',
        shape: "icon",
        icon: {
          face: "'Arial Unicode MS'",
          code: "☻",
          size: 40,
          color: "#ead1dc",
        }
      },
      'Cognizione': { 
        color: '#c9daf8',
        shape: "icon",
        icon: {
          face: "'Arial Unicode MS'",
          code: "☻",
          size: 40,
          color: "#c9daf8",
        }
      }
    },
    physics: {
      stabilization: true,
      barnesHut: {
        gravitationalConstant: -3000,
        springLength: 300,
        springConstant: 0.02
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      zoomView: true,
      dragView: true
    },
    layout: {
      improvedLayout: true
    }
  }
};