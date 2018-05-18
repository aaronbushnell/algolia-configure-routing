import React, { Component } from 'react';
import {
  InstantSearch,
  HierarchicalMenu,
  Hits,
  Menu,
  Pagination,
  PoweredBy,
  RatingMenu,
  RefinementList,
  Configure,
  SearchBox,
  ClearRefinements,
} from 'react-instantsearch/dom';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import qs from 'qs';

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : '';
const urlToSearchState = location => qs.parse(location.search.slice(1));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchState: urlToSearchState(props.location),
    };

    this.handleHits = this.handleHits.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.location !== this.props.location) {
      this.setState({ searchState: urlToSearchState(props.location) });
    }
  }

  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, updateAfter);
    this.setState({ searchState });
  };


  handleHits(ev) {
    let myObj = cloneDeep(this.state.searchState);

    myObj.configure = {
      hitsPerPage: ev.target.value
    };

    this.setState({searchState: myObj});
  }

  render() {
    return (
      <InstantSearch
        appId="latency"
        apiKey="6be0576ff61c053d5f9a3225e2a90f76"
        indexName="ikea"
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={createURL}
      >
        <button onClick={this.handleHits} value="3">Show 3 per page</button>
        <button onClick={this.handleHits} value="6">Show 6 per page</button>
        <button onClick={this.handleHits} value="9">Show 9 per page</button>

        <br />
        <br />
        <br />

        <Configure
          hitsPerPage={
            this.state.searchState.configure &&
            this.state.searchState.configure.hitsPerPage ?
              this.state.searchState.configure.hitsPerPage : 3
          }
        />

        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <SearchBox />
            <PoweredBy />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ padding: '0px 20px' }}>
              <p>Hierarchical Menu</p>
              <HierarchicalMenu
                id="categories"
                attributes={['category', 'sub_category', 'sub_sub_category']}
              />
              <p>Menu</p>
              <Menu attribute="type" />
              <p>Refinement List</p>
              <RefinementList attribute="colors" />
              <p>Range Ratings</p>
              <RatingMenu attribute="rating" max={6} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <ClearRefinements />
              </div>
              <div>
                <Hits />
              </div>
              <div style={{ alignSelf: 'center' }}>
                <Pagination showLast={true} />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.object.isRequired,
};

export default App;
