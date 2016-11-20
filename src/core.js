import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

export function next(state) {
  let entries = state.get('entries').concat(getWinners(state.get('vote')));
  if(entries.size === 1) {
    // Always try to morph old state into new, don't recreate
    return state.remove('vote')
		.remove('entries')
		.set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({
	pair: entries.take(2)
      }),
      entries: entries.skip(2)
    }); 
  }
}

export function vote(voteState, choice) {
  return voteState.updateIn(
    ['tally', choice],
    0,
    tally => tally + 1
  );
}

function getWinners(vote) {
  if(!vote) return [];

  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(["tally", a], 0);
  const bVotes = vote.getIn(["tally", b], 0);

  if(aVotes > bVotes) return [a];
  else if (aVotes < bVotes) return [b];
  else return [a, b];
}
