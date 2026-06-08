// Variáveis do Trator
let tratorX = 400;
let tratorY = 300;
let tratorAngulo = 0;
let velocidade = 0;

// Elementos do Mapa
let trigos = [];
let arvores = [];
let poluicoes = [];

// Indicadores do Jogo
let producaoAgro = 0;
let saudeAmbiental = 100;
let usinaX = 700;
let usinaY = 100;
let usinaTamanho = 120;
let carregandoPoluicao = false;

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  
  // Gerar elementos iniciais no mapa
  for (let i = 0; i < 8; i++) gerarTrigo();
  for (let i = 0; i < 5; i++) gerarArvore();
  for (let i = 0; i < 2; i++) gerarPoluicao();
}

function draw() {
  background(210, 235, 215); // Solo da fazenda sustentável
  
  // 1. Desenhar a Usina Tecnológica de Tratamento
  fill(60, 80, 80);
  rect(usinaX - usinaTamanho/2, usinaY - usinaTamanho/2, usinaTamanho, usinaTamanho, 15);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("USINA DE\nTRATAMENTO", usinaX, usinaY);

  // 2. Controlar e Movimentar o Trator
  controlarTrator();
  
  // 3. Renderizar e checar colisões com os Trigos (Colheita)
  for (let i = trigos.length - 1; i >= 0; i--) {
    let t = trigos[i];
    fill(218, 165, 32); // Cor de trigo maduro
    ellipse(t.x, t.y, 25);
    // Detalhe do trigo
    fill(255, 200, 50);
    ellipse(t.x, t.y, 10);
    
    // Colisão com o trator
    if (dist(tratorX, tratorY, t.x, t.y) < 30) {
      producaoAgro += 50;
      trigos.splice(i, 1);
      gerarTrigo(); // Nasce outro em lugar aleatório
    }
  }

  // 4. Renderizar e checar colisões com as Árvores (Preservação)
  for (let i = arvores.length - 1; i >= 0; i--) {
    let a = arvores[i];
    fill(34, 139, 34); // Copa da árvore
    ellipse(a.x, a.y, 40);
    fill(139, 69, 19); // Tronco
    rect(a.x - 5, a.y, 10, 15);
    
    // Se o trator atropelar a árvore, penaliza o meio ambiente!
    if (dist(tratorX, tratorY, a.x, a.y) < 35) {
      saudeAmbiental -= 20;
      arvores.splice(i, 1);
      gerarArvore();
    }
  }

  // 5. Renderizar e checar manchas de poluição no solo
  for (let i = poluicoes.length - 1; i >= 0; i--) {
    let p = poluicoes[i];
    fill(100, 50, 150, 180); // Mancha Roxa/Óleo
    ellipse(p.x, p.y, 35);
    
    // Trator absorve a poluição para limpar o solo
    if (!carregandoPoluicao && dist(tratorX, tratorY, p.x, p.y) < 30) {
      carregandoPoluicao = true;
      poluicoes.splice(i, 1);
    }
  }
  
  // Se estiver carregando poluição, descarregar na Usina
  if (carregandoPoluicao && dist(tratorX, tratorY, usinaX, usinaY) < usinaTamanho/2) {
    carregandoPoluicao = false;
    saudeAmbiental = min(100, saudeAmbiental + 10); // Limpar o solo recupera o ambiente
    producaoAgro += 20; // Reciclagem gera créditos ecológicos
    gerarPoluicao();
  }

  // 6. Desenhar o Trator com Rotação Física
  desenharTrator();
  
  // 7. Painel de Controle (UI)
  desenharPainel();
  
  // Fim de jogo
  if (saudeAmbiental <= 0) {
    telaFim("COLAPSO AMBIENTAL", "Você destruiu a reserva natural com o maquinário!", color(150, 0, 0));
  } else if (producaoAgro >= 1000) {
    telaFim("AGRO SUSTENTÁVEL ALCANÇADO!", "Parabéns! Você alimentou o mundo protegendo a floresta.", color(34, 139, 34));
  }
}

function controlarTrator() {
  // Setas Esquerda/Direita giram o trator
  if (keyIsDown(LEFT_ARROW))  tratorAngulo -= 4;
  if (keyIsDown(RIGHT_ARROW)) tratorAngulo += 4;
  
  // Setas Cima/Baixo movem para frente e para trás
  if (keyIsDown(UP_ARROW)) {
    velocidade = constrain(velocidade + 0.2, -2, 4);
  } else if (keyIsDown(DOWN_ARROW)) {
    velocidade = constrain(velocidade - 0.2, -2, 4);
  } else {
    velocidade *= 0.92; // Desaceleração natural (atrito)
  }
  
  // Calcular próxima posição baseada no ângulo atual
  tratorX += velocidade * cos(tratorAngulo);
  tratorY += velocidade * sin(tratorAngulo);
  
  // Prender o trator dentro das bordas da tela
  tratorX = constrain(tratorX, 20, width - 20);
  tratorY = constrain(tratorY, 20, height - 20);
}

function desenharTrator() {
  push();
  translate(tratorX, tratorY);
  rotate(tratorAngulo);
  
  // Cor muda se estiver carregando poluição para tratamento
  if (carregandoPoluicao) {
    fill(130, 90, 180); // Trator com brilho roxo (limpando)
  } else {
    fill(34, 100, 34); // Trator Verde Agro clássico
  }
  
  rectMode(CENTER);
  rect(0, 0, 50, 30, 5); // Corpo do trator
  
  // Cabine de Vidro Futurista
  fill(150, 220, 255, 200);
  rect(10, 0, 20, 22, 3);
  
  // Rodas Grandes Traseiras
  fill(0);
  rect(-15, -18, 16, 8, 3);
  rect(-15, 18, 16, 8, 3);
  
  // Rodas Dianteiras
  rect(15, -15, 10, 6, 2);
  rect(15, 15, 10, 6, 2);
  
  pop();
}

// Funções de suporte para criar os itens aleatórios distantes da usina
function gerarTrigo() { trigos.push({ x: random(50, width - 150), y: random(150, height - 50) }); }
function gerarArvore() { arvores.push({ x: random(50, width - 150), y: random(150, height - 50) }); }
function gerarPoluicao() { poluicoes.push({ x: random(50, width - 150), y: random(150, height - 50) }); }

function desenharPainel() {
  fill(255, 240);
  rectMode(CORNER);
  rect(10, 10, 310, 85, 10);
  
  fill(0);
  textAlign(LEFT, TOP);
  textSize(13);
  text("🌾 Safra Comercial: R$ " + producaoAgro + " / 1000", 25, 22);
  text("🌳 Saúde da Reserva: " + saudeAmbiental + "%", 25, 42);
  
  if (carregandoPoluicao) {
    fill(120, 40, 200);
    textSize(11);
    text("⚠️ TANQUE CHEIO: Vá à Usina descarregar o óleo!", 25, 67);
  } else {
    fill(100);
    textSize(11);
    text("⌨️ Use as SETAS do teclado para dirigir o trator.", 25, 67);
  }
}

function telaFim(titulo, msg, cor) {
  fill(0, 230);
  rect(0, 0, width, height);
  fill(cor);
  textSize(30);
  textAlign(CENTER, CENTER);
  text(titulo, width/2, height/2 - 30);
  fill(255);
  textSize(16);
  text(msg, width/2, height/2 + 20);
  noLoop();
}
