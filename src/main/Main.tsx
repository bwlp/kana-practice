import { usePressKey } from './usePressKey';
import { KanaCharacterList } from './KanaCharacterList';
import { generateNewCharacter } from './utils';
import { useState, useEffect } from 'react';
import { useInputState } from './InputStateContext';
import { ICharacterListHistory, TCharacterType } from './types';
import { AppHeader } from './AppHeader';

export const Main = () => {
  const { state, dispatch } = useInputState();
  const [history, setHistory] = useState<ICharacterListHistory[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState('');
  const [type, setType] = useState<TCharacterType>('hiragana');

  usePressKey();

  useEffect(() => {
    if (!currentCharacter) {
      setCurrentCharacter(generateNewCharacter(history));
    } else if (state.current === currentCharacter || state.skip) {
      dispatch({ type: 'set.current.clear' });
      setHistory(
        history.concat({
          character: currentCharacter,
          input: state.current,
          time: state.time ? new Date().getTime() - state.time : 0,
          type,
        })
      );
      setCurrentCharacter('');
    }
  }, [currentCharacter, setCurrentCharacter, history, setHistory, state, dispatch, type]);

  useEffect(() => {
    const localStorageHistory: ICharacterListHistory[] = JSON.parse(localStorage.getItem('history') || '[]');
    if (localStorageHistory.length > 0) {
      setHistory(localStorageHistory);
    }
  }, [setHistory]);

  return (
    <main className="p-2">
      <section className="max-w-3xl mx-auto">
        <AppHeader currentCharacter={currentCharacter} setType={setType} type={type} />
        <KanaCharacterList history={history} />
      </section>
    </main>
  );
};
