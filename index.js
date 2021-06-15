const express = require('express');
const app = express();
app.get('/', (request, response) => {
	response.sendFile(__dirname + '/index.html')
});

app.listen(process.env.PORT);

const dbd = require('aoi.js');
const bot = new dbd.Bot({
  sharding: false,
  shardAmount: 2,
  fetchInvites: true,
  autoUpdate: true,
	prefix: '$getServerVar[prefix]',
	token: process.env.token
});

bot.onMessage();

const fs = require('fs');
let dir = fs.readdirSync('./commands');

let i = 0;

handler: while (i < dir.length) {
	const stat = fs.statSync('./commands/' + dir[i]);

	if (stat.isDirectory()) {
		const readdir = fs.readdirSync('./commands/' + dir[i]);

		let nums = 0;
		while (nums < readdir.length) {
			dir.push(dir[i] + '/' + readdir[nums]);
			nums++;
		}
		i++;
		continue handler;
	} else if (stat.isFile()) {
		const command = require('./commands/' + dir[i]);
		try {
		  if(!Object.keys(command)[0]) {
		  console.log(require("colors").red(`O comando ${dir[i].split("/")[1].split(".js")[0]} precisa de uma key!`))
		  } else {
			bot[Object.keys(command)[0]](command[Object.keys(command)[0]]);
		  }
			i++;
			continue handler;
		} catch (err) {
			console.error(err.message);
			delete dir[i];

			continue handler;
		}
	} else {
		console.error('Directory was not a Folder or File');
		delete dir[i];

		continue handler;
	}
}


//MÚSICA INICIADA
bot.musicStartCommand({
	channel: '$channelID',
	code: `
 $if[$getServerVar[lang]==pt-br]
 $addField[Duração da Música:;
<#$voiceid[$clientid]>
💿▬▬▬▬▬▬▬▬▬▬▬
00:01 / $replaceText[$replaceText[$splitText[3];(;];);]
$textSplit[$songInfo[duration]; ]]
 $addField[Tocando Atualmente:;
[$songInfo[title]]($songInfo[url]) (<@$songInfo[userID]>);no;]
$color[$getVar[color]]
$thumbnail[$userAvatar[773784582855720961]]
$endif

$if[$getServerVar[lang]==en]
 $addField[Music Duration:;
<#$voiceid[$clientid]>
💿▬▬▬▬▬▬▬▬▬▬▬
00:01 / $replaceText[$replaceText[$splitText[3];(;];);]
$textSplit[$songInfo[duration]; ]]
 $addField[Currently Playing:;
[$songInfo[title]]($songInfo[url]) (<@$songInfo[userID]>);no;]
$color[$getVar[color]]
$thumbnail[$userAvatar[773784582855720961]]
$endif`
});
//QUEUE TERMINADO SAINDO DO CANAL DE VOZ
bot.musicEndCommand({
  channel: '$channelID',
  code: `
  $if[$getServerVar[lang]==pt-br]
  $description[💕 Fila terminada, saindo do canal de voz, espero que tenha gostado! Deixe seu feedback no meu [Servidor de Suporte](https://discord.gg/vXvMU3Wcwq) e [vote em mim](https://top.gg/bot/773784582855720961/vote)!!
$image[https://cdn.discordapp.com/attachments/820502414087159809/826647293712531486/PicsArt_03-30-11.33.21.png]
]
$addField[Anúncios;$getVar[ads]]
  $color[FEB1D5]
  $endif
  
  $if[$getServerVar[lang]==en]
  $description[💕 Queue finished, leaving the voice channel, I hope you liked it! Leave your feedback on my [support server](https://discord.gg/vXvMU3Wcwq) and [Vote for me](https://top.gg/bot/773784582855720961/vote)!!
$image[https://cdn.discordapp.com/attachments/820502414087159809/826647293712531486/PicsArt_03-30-11.33.21.png]
]
$addField[Anúncios;$getVar[ads]]
  $color[FEB1D5]
  $endif
  `
});
//BOT ADICIONADA EM UM NOVO SERVIDOR
bot.botJoinCommand({
	channel: '814619255873601546',
	code: `$title[Adicionada em mais um Servidor!]
$thumbnail[$serverIcon]
$description[🎀 Obrigada por me adicionar no servidor \`$serverName\` com \`$membersCount\` Membros!!
<:A_barrinha:814592068864573480>Server ID: \`$guildID\`

🌟 **Agora estou em \`$serverCount\` Servidores! Obrigada a todos!**]
$color[#FEB1D5]
$addTimestamp
`
});
bot.onGuildJoin();
//LOOP RANK CREAMS NO SERVIDOR DE SUPORTE
bot.loopCommand({
code: `$editMessage[825263537919885323;{title:<:creams:829853319405109318> Rank Global de Creams} {description:$globalUserLeaderboard[creams;asc;**{top}°** - <:creams:829853319405109318> {username} - Creams: **{value}**;25]} {footer:Atualizado a cada 5 minutos!} {color:#FEB1D5};819713255491895356]
`,
channel: "819713255491895356",
executeOnStartup: true,
every: 500000
});
//LOOP RANK LIKES NO SERVIDOR DE SUPORTE
bot.loopCommand({
code: `$editMessage[830122354935726200;{title:❤️ Rank Global de Perfis Mais Curtidos} {description:$globalUserLeaderboard[likes;asc;**{top}°** - ❤️ {username} - Likes: **{value}**;25]} {footer:Atualizado a cada 5 minutos!} {color:#FEB1D5};830120889278136342]
`,
channel: "830120889278136342",
executeOnStartup: true,
every: 500000
});
//lyrics música mencionada
bot.command({
name: "lyrics", aliases: ["lyric", "letra"],
code:`$title[$message's Lyrics.] 
$description[$jsonRequest[https://some-random-api.ml/lyrics?title=$message;lyrics;Essa música não possui letra. {deletecommand}{delete:10s}]]
$suppressErrors[Ocorreu um erro ao tentar achar lyrics desta música {deletecommand}{delete:10}]
$footer[$username;$authorAvatar]
$color[#FEB1D5]
$onlyIf[$message!=;]
$onlyIf[$isValidLink[$message]==false;Coloque a letra da música sem links, assim eu não consigo achar :/
**Use:**
\`$getServerVar[prefix]lyrics <Nome da Música>\`
**Exemplo:**
\`$getServerVar[prefix]lyrics Montero Call me By Your Name\`]
})
`
});
// lyrics música atual
bot.command({
name: "lyrics", aliases: ["lyric", "letra"],
code:`$title[[$songInfo[title]]($songInfo[url]) Lyrics.] 
$description[$jsonRequest[https://some-random-api.ml/lyrics?title=$songInfo[title];lyrics;Essa música não possui letra.{deletecommand}{delete:10s}]]
$suppressErrors[Ocorreu um erro ao tentar achar lyrics desta música {deletecommand}{delete:10}]
$footer[$username;$authorAvatar]
$color[#FEB1D5]
$onlyIf[$voiceID!=;]
$onlyIf[$message==;]
`
});
//WELCOME SETADO
bot.joinCommand({
 channel: "$getServerVar[welcome]",
 code: `$giveRoles[$authorID;$getServerVar[autorole]]
$suppressErrors[]
<@$authorID>
 $author[Welcome!]
 $description[-> O Usuário **$userTag** acabou de entrar no servidor, divirta-se! 😆
Agora somos $membersCount membros!]
 `
});
bot.onJoined()
//LEAVE SETADO
bot.leaveCommand({
 channel: "$getServerVar[leave]",
 code: `<@$authorID>
 $author[Bye Bye!]
 $description[-> O Usuário **$userTag** acabou de deixar o servidor, tomará que um dia ele(a) volte! 🥺
 Agora somos $membersCount membros.]
 
 
 `
})
bot.onLeave() 