class Ativo{
  constructor(name, price, amount, dividend_yield, x, y, w, h, range, cor_da_linha){
    this.name = name;
    this.price = price;
    this.amount = amount;
    this.dividend_yield = dividend_yield;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.range = range;
    
    //average variables
    this.amount_of_prices = 1;
    this.sum = 0;
    this.average = 0;
    this.list_averages = [];
    this.index_avg = 0;
    this.graphicXAvg = 40;
    
    //prices variables
    this.list_prices = [];
    this.index_price = 0;
    this.graphicXPrice = 40;
    
    this.cor_da_linha = cor_da_linha;
  }
  
  updatePrice(){ //update price with each click on screen
    this.price = random(this.price-(this.range/2), this.price+(this.range/2));
    this.price = round(this.price, 2);
    if(this.price <= 0.00){
      this.price = 0.01;
    }
    this.calculateAveragePrices();
    this.list_prices[this.index_price] = this.price;
    this.index_price++;
  }
  
  buttonBuy(){ //display buy button and text on screen
    textSize(30);
    fill('white');
    rect(this.x, this.y, this.w, this.h, 10);
    fill('black');
    text("Comprar "+this.name, this.x+3, this.y+30);
    this.c_right = this.x + this.w;
    this.c_bottom = this.y + this.h;
  }
  
  buttonSell(){ //display sell button and text on screen
    textSize(30);
    fill('white');
    rect(this.x, this.y + this.h, this.w, this.h, 10);
    fill('black');
    text("Vender "+this.name, this.x+3, this.y+70);
    this.v_top = this.y + this.h;
    this.v_right = this.x + this.w;
    this.v_bottom = this.v_top + this.h;
  }
  
  buttonBuyAll(){ //display buy all button and text on screen
    textSize(30);
    this.buyAllRectx = this.x;
    this.buyAllRecty = this.y + this.v_bottom + 10;
    fill('green');
    rect(this.buyAllRectx, this.buyAllRecty, 270, 50);
    fill('black');
    text("Comprar Máximo", this.buyAllRectx + 8, this.buyAllRecty + 35);
  }
  
  buttonSellAll(){ //display sell all button and text on screen
    textSize(30);
    this.sellAllRectx = this.x;
    this.sellAllRecty = this.buyAllRecty + 10 + 50 + 10;
    fill('red');
    rect(this.sellAllRectx, this.sellAllRecty, 270, 50);
    fill('black');
    text("Vender Tudo", this.buyAllRectx + 8, this.sellAllRecty + 35);
  }
  
  shareDividends(balance){ //increases balance by value of dividends
    balance += (this.amount * (this.price * this.dividend_yield));
    return round(balance, 2);
  }
  
  buyOrSell(balance, song, play_it){ //handles all buying and selling options --- Each click on the screen is verified here to check if any option was chosen
  if(mouseX>=this.x && mouseX<=this.c_right && mouseY>=this.y && mouseY<=this.c_bottom){
    if(balance>=this.price){
      this.amount++;
      balance -= this.price;
      if(play_it) song.play();
    }
  }
  else if(mouseX>=this.x && mouseX<=this.v_right && mouseY>=this.v_top && mouseY<=this.v_bottom){
    if(this.amount>0){
      this.amount--;
      balance += this.price;
      if(play_it) song.play();
    }
  }
  return balance;
  }
  
  buyOrSellAll(balance, song, play_it){
    if(mouseX>= this.buyAllRectx && mouseX <= this.buyAllRectx+270 && mouseY >= this.buyAllRecty && mouseY <= this.buyAllRecty + 50){
      this.recently_acquired_amount = Math.floor(balance/this.price);
      this.amount += this.recently_acquired_amount;
      balance -= (this.price * this.recently_acquired_amount); //new balance = balance - price * recently acquired amount
      if(play_it) song.play();
    }
    if(mouseX>=this.sellAllRectx && mouseX <= this.sellAllRectx + 270 && mouseY >= this.sellAllRecty && mouseY <= this.sellAllRecty + 50){
      balance += this.amount * this.price;
      this.amount = 0;
      if(play_it) song.play();
    }
    
    return balance
  }
  
  calculateAveragePrices(){ //calculates average of the prices up to the last 5 prices (last price, last 2 prices, last 3 prices, last 4 prices, last 5 prices, then reset)
    this.sum += this.price;
    this.average = this.sum/this.amount_of_prices;
    this.average = round(this.average, 2);
    if(this.amount_of_prices%5 == 0){
      this.list_averages[this.index_avg] = this.average;
      this.index_avg++;
      this.sum = 0;
      this.amount_of_prices = 0;
    }
    this.amount_of_prices++;
  }
  
  displayAvg(xAvg, yAvg){ //display / put average on screen
    fill('white');
    rect(xAvg, yAvg, 265, 60);
    fill('black');
    textSize(36);
    text("Média:" + this.average, xAvg + 2, yAvg + 38);
  }
  
  updateGraphicPrice(){ //handles the graphic that displays price info
    if(this.list_prices.length > 24){
      this.index_price = 0;
      this.list_prices.length = 0;
      this.graphicXPrice = 40;
    }
    
    for(var i = 0; i < this.list_prices.length - 1; i++){
      line(this.graphicXPrice, 790 - (this.list_prices[i]*3), this.graphicXPrice + 30, 790 - (this.list_prices[i + 1] * 3));
      
      if(i < this.list_prices.length - 2){
        this.graphicXPrice += 30;
      }
      
      else{ //if last iteractioin through loop
        this.graphicXPrice = 50;
      }
      
    }
  }

  updateGraphicCircle(){  //handles the graphic that displays average info
    if(this.list_averages.length > 4){
      this.index_avg = 0;
      this.list_averages.length = 0;
      this.graphicXAvg = 40;
    }
    for(var i = 0; i < this.list_averages.length; i++){
      fill(this.cor_da_linha);
      circle(this.graphicXAvg + 150, 790 - (this.list_averages[i] * 3), 15);
      if(i < this.list_averages.length - 1){
        this.graphicXAvg += 150;
      }
     
       else{ //if last iteraction through loop
         this.graphicXAvg = 10;
       }
    }
  }
}

//global variables
var desloc_average = 330; // change y pos of rects and text with avg
var screen = 1;
var level = 1;

var balance = 100; //saldo
var objective = 5000;
var invested_value = 0;
var months = 0; //by clicking on the game screen for the first time, it already increases by one
var top_score = 0;

var dy_fii = 0.008;

var reached = false; //atingiu
var locked_congrats_screen = false; //travado

//manage back button and text within
var x_back = 1090;
var y_back = 740;
var w_back = 100;
var h_back = 50;
var xTextBack = 1098;
var yTextBack = 775;

//manage audio button and text within
var x_audio = 1090;
var y_audio = 680;
var w_audio = 100;
var h_audio = 50;
var xTextAudio = 1098;
var yTextAudio = 715;

//manage lock prices button and text within
x_lock = 1035;
y_lock = 620;
w_lock = 155;
h_lock = 50;
xTextLock = 1045;
yTextLock = 655;

//manage all rects in menu at once  
var rects_menu = 530;

var primeiroX = 20;
var segundoX = 320;
var terceiroX = 620;
var quartoX = 920;

var primeiroY = 10;
var segundoY = 10;
var terceiroY = 10;
var quartoY = 10;
  
var primeiroW = 230;
var segundoW = 230;
var terceiroW = 230;
var quartoW = 230;
  
var primeiroH = 40;
var segundoH = 40;
var terceiroH = 40;
var quartoH = 40;
          

//creating objetcs
var acao = new Ativo("Ação", 2, 0, 0, primeiroX, primeiroY, primeiroW, primeiroH, 8, 'red');
var fii = new Ativo("FII", 10, 0, dy_fii, segundoX, segundoY, segundoW, segundoH, 4, 'green');
var cdb = new Ativo("CDB", 100, 0, 0, terceiroX, terceiroY, terceiroW, terceiroH, 4, 'blue');
var bdr = new Ativo("BDR", 50, 0, 0, quartoX, quartoY, quartoW, quartoH, 4, 'yellow');

var img_perfil;
var img_dinheiro;
var img_background_menu;
var falling_coin;

var lock_prices = true;
var play_song = true;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function preload(){
  img_perfil = loadImage('Assets/FOTOENZOSIGAA.jpeg'); 
  img_dinheiro = loadImage('Assets/d.png');
  img_background_menu = loadImage('Assets/backgroundAI.png');
  falling_coin = loadSound('Assets/audioMoedaCaindo.mp4');
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function setup() {
  createCanvas(1200, 800);
  //falling_coin.play();
}

function draw() {
  //code to show "Congratulations" screen only once
  if (invested_value > objective){
    reached = true;
  }
  
  if (reached && !locked_congrats_screen){
    screen = 6;
    locked_congrats_screen = true;
  }
  
  if(invested_value > top_score) top_score = invested_value;
  
  if (screen==1){ //main menu screen
    image(img_background_menu, 0, 0, 1200, 800);
    textSize(50)
    fill('black');
    text("Simulador de Investimentos", 290, 50);
    textSize(30);
    fill('white');
    rect(rects_menu, 70, 150, 50, 10);
    rect(rects_menu, 130, 150, 50, 10);
    rect(rects_menu, 190, 150, 50, 10);
    rect(rects_menu, 250, 150, 50, 10);
    fill('black');
    text("Play", 572, 105);
    text("Intruções", 536, 165);
    text("Aprender", 536, 225);
    text("Créditos", 542, 285);
  }
  
  else if(screen == 2){ //game screen
    background('rgb(89,240,131)');
    //displaying buttons and average
    acao.buttonBuy();
    acao.buttonSell();
    acao.buttonBuyAll();
    acao.buttonSellAll();
    acao.displayAvg(acao.x, acao.y + desloc_average);
    
    fii.buttonBuy();
    fii.buttonSell();
    fii.buttonBuyAll();
    fii.buttonSellAll();
    fii.displayAvg(fii.x, fii.y + desloc_average);
    
    cdb.buttonBuy();
    cdb.buttonSell();
    cdb.buttonBuyAll();
    cdb.buttonSellAll();
    cdb.displayAvg(cdb.x, cdb.y + desloc_average);
    
    bdr.buttonBuy();
    bdr.buttonSell();
    bdr.buttonBuyAll();
    bdr.buttonSellAll();
    bdr.displayAvg(bdr.x, bdr.y + desloc_average);
    
    
    fill('black');
    
    textSize(31);
    //displaying prices and amounts
    text("Preço Ação "+acao.price, acao.x, acao.y + 260);
    text("Quant. Ação "+acao.amount, acao.x, acao.y + 305);
    
    text("Preço FII "+fii.price, fii.x, fii.y + 260);
    text("Quant. FII "+fii.amount, fii.x, fii.y + 305);
    
    text("Preço CDB "+cdb.price, cdb.x, cdb.y + 260);
    text("Quant. CDB "+cdb.amount, cdb.x, cdb.y + 305);
    
    text("Preço BDR "+bdr.price, bdr.x, bdr.y + 260);
    text("Quant. BDR "+bdr.amount, bdr.x, bdr.y + 305);
    
    
    textSize(30);
    text("Saldo "+balance, 795, 510);
    text("Valor Investido "+invested_value, 795, 560);
    text("Top Score "+top_score, 795, 610);
    text("Meses "+months, 795, 660);
    text("Nível "+level, 795, 710);
    
    desenharLinhasProporcional();
    
    //graphic prices
    acao.updateGraphicPrice();
    fii.updateGraphicPrice();
    cdb.updateGraphicPrice();
    bdr.updateGraphicPrice();
    
    //graphic average circles
    acao.updateGraphicCircle();
    fii.updateGraphicCircle();
    cdb.updateGraphicCircle();
    bdr.updateGraphicCircle();
    
    if((level == 1) && (invested_value > 150)){
      level++;
      
    }
    
    else if((level == 2) && (invested_value > 500)){
      level++;
      
    }
    else if((level == 3) && (invested_value > 1000)){
      level++;
      
    }
    else if((level == 4) && (invested_value > 1800)){
      level++;
      
    }
    else if((level == 5) && (invested_value > 2700)){
      level++;
      
    }
    else if((level == 6) && (invested_value > 3700)){
      level++;
      
    }
    else if((level == 7) && (invested_value > 4700)){
      level++;
      
    }
    else if((level == 8) && (invested_value > 5000)){
      level++;
      
    }
    
    else if(level == 9){
      level = "simulador"
    }
    
    backButton();
    audioButton();
    lockPrices();
  }
  
  else if(screen == 3){ //instructions screen
    background('rgb(130,245,162)');
    fill('black');
    textSize(24);
    text("Ano: 9º Ano do Ensino Fundamental | Matéria: Matemática | Habilidade BNCC: (EF09MA22)" + "\n" + "Escolher e construir o gráfico mais adequado (colunas, setores, linhas), com ou sem uso de" + "\n" + "planilhas eletrônicas, para apresentar um determinado conjunto de dados, destacando aspectos"+ "\n" + "como as medidas de tendência central." + "\n\n" + "Através deste jogo, tenho por objetivo ensinar sobre o mundo dos investimentos e educação " + "\n" + "financeira de maneira lúdica. " + "\n\n" + "R$1000 investidos a partir de R$100, será que é possível?" + "\n" + "Com certeza!!!" + "\n\n" + "Para fazer isto, você pode comprar e vender diversos tipos de ativos, tais como Ações e FIIs." + "\n" + "Porém, atente-se, a cada compra ou venda realizada, o valor pode ou não variar." + "\n\n" + "Se os preços estão caros, é possível atualizá-los a partir de cliques em qualquer ponto da tela;" + "\n\n" + "Ao clicar no botão 'Áudio', você pode desativar ou ativar os efeitos sonoros do jogo e, ao clicar no" + "\n\n" + "botão 'Voltar', você irá retornar para a tela inicial ou para a tela do jogo.", 10, 40);
    backButton();
  }
  
  else if(screen == 4){ // learning screen
    background('rgb(130,245,162)');
    textSize(24);
    text("O que são Ativos?" + "\n\n" + "Ativos são responsáveis por fazer com que você enriqueça. Alguns tipos mais comuns são:" + "\n\n" + "Ações: são partes de uma empresa gigante e, ao adquirir uma ação, você se torna dono de " + "\n" + "uma pequena fração desta empresa." + "\n\n" + "FIIs (Fundo de Investimento Imobiliário): são fundos que investem ou em imóveis (estes são do" + "\n" + "tipo Tijolo), ou em dívidas do setor imobiliário (estes são do tipo Papel) ou em ambos (Híbridos)." + "\n\n" + "CDBs (Certificado de Depósito Bancário): são “empréstimos”, nos quais você empresta seu" + "\n" + "dinheiro para o banco, e não ao contrário." + "\n\n" + "BDRs (Brazilian Depositary Receipt): são uma maneira de investir em empresas do exterior." +"\n\n"+"Além disso, é importante que, ao montar sua carteira de investimentos, você diversifique ao" + "\n" + "máximo seus ativos, para reduzir as probabilidades de perder dinheiro com desvalorizações.", 10, 30);
    backButton();
  }
  
  else if(screen == 5){ //credits screen
    image(img_background_menu, 0, 0, 1200, 800);
    image(img_perfil, 10, 10, 700, 780);
    fill('black');
    textSize(80);
    text("Enzo", 720, 65);
    writeVertical();
    textSize(70);
    fill('red');
    rect(810, 80, 260, 90);
    
    fill('green');
    rect(810, 200, 370, 90);
    
    fill('blue');
    rect(810, 320, 180, 90);
    
    fill('black');
    text("Python", 820, 150);
    text("JavaScript", 820, 270);
    text("C++", 820, 390);
    
    backButton();
  }
  
  else if(screen == 6){ //congratulations screen for 1st level
    image(img_dinheiro, 0, 0, 1200, 800);
    textSize(100);
    fill('white');
    rect(420, 310, 380, 110);
    fill('black');
    text("Parabéns", 430, 400);
    textSize(30);
    backButton();
  }
}

function mouseClicked(){ //navigate through screens
  if(mouseX>=rects_menu && mouseX<=rects_menu+130 && mouseY>=70 && mouseY<=120 && screen==1){
    screen = 2;
  }
  else if(mouseX>=rects_menu && mouseX<=rects_menu+130 && mouseY>=130 && mouseY<=180 && screen==1){
    screen = 3;
  }
  else if(mouseX>=rects_menu && mouseX<=rects_menu+130 && mouseY>=190 && mouseY<=240 && screen==1){
    screen = 4;
  }
  else if(mouseX>=rects_menu && mouseX<=rects_menu+130 && mouseY>=250 && mouseY<= 300 && screen == 1){
    screen = 5;  
  }
  
  //return to main screen or to game screen
  if(mouseX>=x_back && mouseX<=x_back+w_back && mouseY>=y_back && mouseY<=y_back+h_back && screen != 1){
    if(screen == 6) screen = 2; //if player is on screen 6, it goes back into game screen
    else screen = 1; //if player is in another screen, it goes back to the main menu
  }
  
  if(mouseX>=x_audio && mouseX<=x_audio+w_audio && mouseY>=y_audio && mouseY<=y_audio+h_audio && screen == 2){
    //switching between true and false, allowing song to be played or not
    if(play_song) play_song = false;
    else play_song = true;
  }
  
  if(mouseX>=x_lock && mouseX<=x_lock+w_lock && mouseY>=y_lock && mouseY<=y_lock+h_lock){
    //switching between true and false, allowing prices to be locked or not
    if(lock_prices) lock_prices = false;
    else lock_prices = true;
  }
  
  if (screen == 2){
    balance = acao.buyOrSell(balance, falling_coin, play_song);
    balance = acao.buyOrSellAll(balance, falling_coin, play_song);
    balance = fii.buyOrSell(balance, falling_coin, play_song);
    balance = fii.buyOrSellAll(balance, falling_coin, play_song);
    balance = cdb.buyOrSell(balance, falling_coin, play_song);
    balance = cdb.buyOrSellAll(balance, falling_coin, play_song);
    balance = bdr.buyOrSell(balance, falling_coin, play_song);
    balance = bdr.buyOrSellAll(balance, falling_coin, play_song);
    
    if(lock_prices){
      acao.updatePrice();
      fii.updatePrice();
      cdb.updatePrice();
      bdr.updatePrice();
      
      balance = fii.shareDividends(balance);
      
      months++; //increase month by one every click
    }
    
    invested_value = round((acao.amount*acao.price) + (fii.amount*fii.price) + (cdb.amount*cdb.price) + (bdr.amount*bdr.price), 2);
  }
}

function writeVertical(){
  var myText = "Programador";
  var new_text = "";
  for (var i = 0; i < 11; i ++){
     new_text += myText[i] + "\n";
  }
  fill('white');
  rect(725, 90, 60, 590);
  fill('black');
  textSize(40);
  text(new_text, 740, 130);
}

function backButton(){ //create back button
  textSize(30);
  fill('white');
  rect(x_back, y_back, w_back, h_back);
  fill('black');
  text("Voltar", xTextBack, yTextBack);
}
function audioButton(){ //create audio button
  textSize(30);
  fill('white');
  rect(x_audio, y_audio, w_audio, h_audio);
  fill('black');
  text("Áudio", xTextAudio, yTextAudio);
}

function lockPrices(){
  textSize(30);
  fill('white');
  rect(x_lock, y_lock, w_lock, h_lock);
  fill('black');
  text("Congelar", xTextLock, yTextLock);
}

function desenharLinhasProporcional(){ //each 10 of invested value, y axis must increase by 30 pixels (a cada 10 de valor investido, o y deve subir 30)
  var escala = 0; //escala
  var posy = 790;
  textSize(20);
  for(var i = 0; i < 11; i++){
    text(escala, 10, posy);
    line(0, posy, 780, posy);
    escala += 10;
    posy -= 30;
  }
}