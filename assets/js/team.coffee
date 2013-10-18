define ['util', 'player'], (Util, Player) ->
  class Team
    constructor: (@tournament, other) ->
      if other
        for key, value of other
          this[key] = value
      @name ?= ""
      @players ?= []
      @rounds ?= {}
      if not other
        for round in @tournament.rounds
          round.registerTeam this

    unpackCycles: ->
      @club = Util.unpackCycle @club, @tournament.clubs
      Util.unpackCycles @players, @tournament.players
      for id, opts of @rounds
        round = @tournament.roundWithId id
        if round and opts.ballot?
          opts.ballot = Util.unpackCycle opts.ballot, round.ballots
    
    toJSON: ->
      model = Util.copyObject this, ['tournament', 'rounds', 'stats']
      model.club = Util.packCycle @club, @tournament.clubs
      model.players = Util.packCycles @players, @tournament.players
      model.rounds = {}
      for id, opts of @rounds
        round = @tournament.roundWithId id
        model.rounds[id] = mopts = Util.copyObject opts
        if round and opts.ballot
          mopts.ballot = Util.packCycle opts.ballot, round.ballots
      return model

    getStats: (rounds) ->
      o =
        rawWins: 0
        rawScore: 0
        rawReply: 0
        rawHLScore: 0
        rawHLRounds: 0 #this includes botched
        rawBallots: 0
        byeWins: 0
        byeBallots: 0
        byeHLRounds: 0
        wins: 0
        score: 0
        reply: 0
        scoreHighLow: 0
        ballots: 0
        roundsPlayed: 0
        roundsBotched: 0 #zeros
      for round in rounds
        round = round.id if typeof round == 'object'
        ballot = @rounds[round].ballot
        continue if not ballot.locked
        if this == ballot.teams[0]
          side = 0
        else if this == ballot.teams[1]
          side = 1
        else continue
        if ballot.presence[side]
          if ballot.presence[1-side] and ballot.teams[1-side]
            o.roundsPlayed++
            score = 0
            replyScore = 0
            ballots = 0
            wins = 0
            for vote in ballot.votes
              for i in [0...4]
                score += vote.scores[side][i] * vote.ballots
              replyScore += vote.scores[side][3] * vote.ballots
              ballots += vote.ballots
              wins += if side then vote.opp else vote.prop
            if wins > ballots - wins
              o.rawWins++
            o.rawBallots += wins
            if ballots
              score /= ballots
              replyScore /= ballots
            o.rawScore += score
            o.rawReply += replyScore
          else
            o.byeWins++
            o.byeBallots += round.ballotsPerMatchSolved()
        else
          o.roundsBotched++
      o.wins = o.rawWins + o.byeWins
      o.ballots = o.rawBallots + o.byeBallots
      rp = o.roundsPlayed + o.roundsBotched
      averageScore = 245
      averageReply = 35
      o.score = o.rawScore + o.byeWins * if rp then (o.rawScore / rp) else averageScore
      o.reply = o.rawReply + o.byeWins * if rp then (o.rawReply / rp) else averageReply
      rp = o.rawHLRounds
      o.scoreHighLow = o.rawHLScore + o.byeHLRounds * if rp then (o.rawHLScore / rp) else 245
      o.wins = o.rawWins + o.byeWins
      o.ballots = o.rawBallots + o.byeBallots
      return o

    addPlayer: ->
      pl = new Player @tournament
      @players.push pl
      @tournament.players.push pl
      pl.team = this

    removePlayer: (player) ->
      idx = @players.indexOf player
      @players.splice idx, 1

    removePlayerAtIndex: (index) ->
      player = @players[index]
      @players.splice index, 1
      arr = @tournament.players
      idx = arr.indexOf player
      arr.splice idx, 1

    destroy: ->
      for round in @tournament.rounds
        round.unregisterTeam this
      if @club
        @club.removeTeam(this)
