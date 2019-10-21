var players = [];
var playerFlags = [];
var salary;
var playerCount = 0;
var validTransaction = "valid";

function newPlayer()
{
    playerCount++;
    var temp = document.getElementsByTagName("template")[0];
    var newPlayer = temp.content.cloneNode(true);
    var players = document.getElementById("Players");
    players.appendChild(newPlayer);
}

function start()
{
    var newPlayerButton = document.getElementById("newPlayer");
    var initialAmountTextBox = document.getElementById("initialAmount");
    var salaryTextBox = document.getElementById("salary");
    var startButton=document.getElementById("start");
    if(initialAmountTextBox.value!="" && salaryTextBox.value!="")
    {
    newPlayerButton.disabled = true;
    initialAmountTextBox.disabled = true;
    salaryTextBox.disabled = true;
    startButton.disabled=true;
    var initialAmount = document.getElementById("initialAmount").value;
    salary = document.getElementById("salary").value;
    var players = document.getElementsByClassName("Player");
    for(var i=1;i<=players.length;i++)
    {
        players[i-1].id="player"+i;
        players[i-1].childNodes[4].childNodes[1].innerText=initialAmount;
        updatePassbook(players[i-1],"Received "+initialAmount+" from bank.");
        playerFlags.push("0");
    }
    for(var i=0;i<players.length;i++)
    {
        updatePlayerLists(players[i].childNodes[11],i);
    }
    var bankCombo = document.getElementById("bankComboList");
    updatePlayerLists(bankCombo,-1);
    for(var i=0;i<players.length;i++)
    {
        var name = players[i].childNodes[1].childNodes[1].value;
        players[i].removeChild(players[i].childNodes[1]);
        players[i].innerHTML = "<label id='playerName'>"+name+"</label>"+players[i].innerHTML;
    }
    }
    else
    {
        alert('Enter the values in all boxes.'); 
    }
}

function removePlayer(player)
{
    player.parentNode.parentNode.parentNode.parentNode.removeChild(player.parentNode.parentNode.parentNode);
    playerCount--;
}

function reset()
{
    if(confirm("Do you want to reset?"))
        location.reload();
}

function updatePlayerLists(combo,j) {
    var players = document.getElementsByClassName("Player");
    for(var i=0;i<players.length; i++)
    {
        if(i==j)
            continue;
        var option = document.createElement("option");
        option.text = players[i].childNodes[1].childNodes[1].value;
        option.value = players[i].id;
        try {
            combo.add(option, null); //Standard
        }catch(error) {
            combo.add(option); // IE only
        }
    }
}

function getSalary(elem)
{
    var elemIdNum = elem.parentNode.id.substring(6,elem.parentNode.id.length);
    if(playerFlags[Number(elemIdNum)-1]==0)
    {
        addBalance(elem.parentNode,salary,"bank");
        playerFlags[Number(elemIdNum)-1]=1;
    }
}

function pay(elem)
{
    var combobox = elem.parentNode.childNodes[11];
    var amount = elem.parentNode.childNodes[12].value;
    executeTransactions(elem.parentNode,combobox,amount);
}

function executeTransactions(elem1,elem2,amount)
{
    if(amount!="")
    {
        addBalance(elem1,-1*Number(amount),elem2.value=="bank"?"bank":document.getElementById(elem2.value));
        if(elem2.value!="bank" && validTransaction=="valid")
        {
            addBalance(document.getElementById(elem2.value),amount,elem1);
        }
        validTransaction = "valid";
        elem1.childNodes[12].value="";
    }
}

function addBalance(elem,amount,payerElem)
{
    var balanceField = elem.childNodes[4].childNodes[1];
    if(Number(balanceField.innerText)+Number(amount)>0)
    {
        balanceField.innerText = Number(balanceField.innerText)+Number(amount);
        var x = document.getElementById("coins");
        x.play();
        var elemIdNum = elem.id.substring(6,elem.id.length);
        for(var i=0;i<playerFlags.length;i++)
            playerFlags[i]=0;
            if(payerElem=="bank")
            payer="bank";
        else
            var payer=payerElem.childNodes[0].innerHTML;
        if(Number(amount)<0)
        {
            updatePassbook(elem,"Paid Rs."+(-1*amount)+" to "+payer);
        }
        else if(Number(amount)>0)
        {
            updatePassbook(elem,"Received Rs."+amount+" from "+payer);
        }
    }
    else
    {
        validTransaction="invalid";
        alert("You have insufficient balance");
    }
}

function bankPay()
{
    var amount = document.getElementById("bankAmount").value;
    document.getElementById("bankAmount").value = "";
    if(amount!="")
    {
        var playerId = document.getElementById("bankComboList").value;
        var player = document.getElementById(playerId);
        addBalance(player,amount,"bank");
    }
    else
    {
        alert('Enter the amount!');
    }
}

function bankGet()
{
    var amount = document.getElementById("bankAmount").value;
    if(amount!="")
    {
        var playerId = document.getElementById("bankComboList").value;
        var player = document.getElementById(playerId);
        addBalance(player,-1*amount,"bank");
    }
    else
    {
        alert('Enter the amount!');
    }
}

function showTransactions(elem)
{
    var card = elem.parentNode.parentNode;
    card.classList.toggle('flipped');
}

function flipBack(elem)
{
    var card = elem.parentNode.parentNode;
    card.classList.toggle('flipped');
}

function updatePassbook(player,transaction)
{
    var table = player.parentNode.childNodes[3].childNodes[1].childNodes[1]
    var row = table.insertRow(1);
    var column = row.insertCell(0);
    column.innerHTML = transaction;
}

function fillAmount(elem,amount)
{
    var player=elem.parentNode.parentNode.parentNode.parentNode.parentNode;
    var combobox = player.childNodes[11];
    executeTransactions(player,combobox,amount);
}