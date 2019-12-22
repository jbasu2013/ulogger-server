/*
 * μlogger
 *
 * Copyright(C) 2019 Bartek Fabiszewski (www.fabiszewski.net)
 *
 * This is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

import MainViewModel from '../src/mainviewmodel.js';
import ViewModel from '../src/viewmodel.js';
import uState from '../src/state.js';

describe('MainViewModel tests', () => {

  const hiddenClass = 'menu-hidden';
  let vm;
  let state;
  let menuEl;
  let userMenuEl;

  beforeEach(() => {
    const fixture = `<div id="fixture">
                        <div>
                          <a id="user-menu-button" data-bind="onShowUserMenu">user</a>
                          <div id="user-menu" class="menu-hidden"></div>
                        </div>
                        <div id="menu">
                          <div id="menu-button"><a data-bind="onMenuToggle"></a></div>
                        </div>
                     </div>`;
    document.body.insertAdjacentHTML('afterbegin', fixture);
    menuEl = document.querySelector('#menu');
    userMenuEl = document.querySelector('#user-menu');
    spyOn(window, 'addEventListener');
    spyOn(window, 'removeEventListener').and.callThrough();
    state = new uState();
    vm = new MainViewModel(state);
  });

  afterEach(() => {
    document.body.removeChild(document.querySelector('#fixture'));
  });

  it('should create instance', () => {
    expect(vm).toBeInstanceOf(ViewModel);
    expect(vm.state).toBe(state);
    expect(vm.menuEl).toBe(menuEl);
    expect(vm.userMenuEl).toBe(userMenuEl);
  });

  it('should hide side menu', (done) => {
    // given
    const buttonEl = document.querySelector('#menu-button a');
    vm.init();
    // when
    buttonEl.click();
    // then
    setTimeout(() => {
      expect(menuEl.classList.contains(hiddenClass)).toBe(true);
      done();
    }, 100);
  });

  it('should show side menu', (done) => {
    // given
    const buttonEl = document.querySelector('#menu-button a');
    menuEl.classList.add(hiddenClass);
    vm.init();
    // when
    buttonEl.click();
    // then
    setTimeout(() => {
      expect(menuEl.classList.contains(hiddenClass)).toBe(false);
      done();
    }, 100);
  });

  it('should hide user menu', (done) => {
    // given
    const buttonEl = document.querySelector('#user-menu-button');
    userMenuEl.classList.remove(hiddenClass);
    vm.init();
    // when
    buttonEl.click();
    // then
    setTimeout(() => {
      expect(userMenuEl.classList.contains(hiddenClass)).toBe(true);
      done();
    }, 100);
  });

  it('should show user menu', (done) => {
    // given
    const buttonEl = document.querySelector('#user-menu-button');
    vm.init();
    // when
    buttonEl.click();
    // then
    setTimeout(() => {
      expect(userMenuEl.classList.contains(hiddenClass)).toBe(false);
      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.addEventListener).toHaveBeenCalledWith('click', vm.hideUserMenuCallback, true);
      done();
    }, 100);
  });

  it('should hide user menu on window click', (done) => {
    // given
    userMenuEl.classList.remove(hiddenClass);
    window.addEventListener.and.callThrough();
    window.addEventListener('click', vm.hideUserMenuCallback, true);
    vm.init();
    // when
    document.body.click();
    // then
    setTimeout(() => {
      expect(userMenuEl.classList.contains(hiddenClass)).toBe(true);
      expect(window.removeEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledWith('click', vm.hideUserMenuCallback, true);
      done();
    }, 100);
  });

});
