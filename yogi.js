var debug = require ('./debug');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Yogi {
    constructor ()
    {
        this.isms = [
            "When you come to a fork in the road, take it.",
            "You can observe a lot by just watching.",
            "It ain’t over till it’s over.",
            "It’s like déjà vu all over again.",
            "No one goes there nowadays, it’s too crowded.",
            "Baseball is ninety percent mental and the other half is physical.",
            "A nickel ain’t worth a dime anymore.",
            "Always go to other people’s funerals, otherwise they won’t come to yours.",
            "We made too many wrong mistakes.",
            "Congratulations. I knew the record would stand until it was broken.",
            "Cut the pizza into four slices - I dont think I can eat six.",
            "You wouldn’t have won if we’d beaten you.",
            "I usually take a two-hour nap from one to four.",
            "Never answer an anonymous letter.",
            "Slump? I ain’t in no slump… I just ain’t hitting.",
            "How can you think and hit at the same time?",
            "The future ain’t what it used to be.",
            "I tell the kids, somebody’s gotta win, somebody’s gotta lose. Just don’t fight about it. Just try to get better.",
            "It gets late early out here.",
            "If the people don’t want to come out to the ballpark, nobody’s going to stop them.",
            "We have deep depth.",
            "Pair up in threes.",
            "Why buy good luggage, you only use it when you travel.",
            "You’ve got to be very careful if you don’t know where you are going, because you might not get there.",
            "All pitchers are liars or crybabies.",
            "Better cut that pizza into six slices, I don't think I can eat eight",
            "Little League is good—it keeps parents off the streets.",
            "I didn’t really say everything I said.", 
            "It was impossible to get a conversation going—everybody was talking too much.",
            "You can’t think and hit at the same time.",
            "If the people don’t want to come out to the ballpark, nobody’s going to stop them.",
            "Even Napoleon had his Watergate.",
            "It’s not the heat, it’s the humility.",
            "He hits from both sides of the plate—he’s amphibious.",
            "We’re lost, but we’re making good time."

        ];
    }

    getIsm()
    {   
        var index = getRandomInt (0, (this.isms.length - 1));
        var ism = this.isms [index];
        debug ("Yogi says: " + ism);
        return (ism);
    }
}

module.exports = new Yogi();