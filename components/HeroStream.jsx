'use strict';

import _ from 'lodash';
import React from 'react/addons';
import Immutable from 'immutable';
import { ComponentMixin as ImmutableMixin } from 'fluxible-immutable-utils';

// components
import HeroSlide from './HeroSlide';
import HeroVideo from './HeroVideo';
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var HeroStream = React.createClass({
    mixins: [ ImmutableMixin ],
    propTypes: {
        heroYoutubeId: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            initSlideIndex: 0,
            gapBetweenClick: 200,
            videoPerPage: 6
        };
    },
    getInitialState() {
        return {
            slideAnimation: 'hero-slide-left',
            slideIndex: this.props.initSlideIndex,
            slides: Immutable.List()
        };
    },
    componentWillMount() {
        var heroVideo;
        var slides;
        var slideIndex = 0;

        this.videos = this.props.stream.get('videos', Immutable.List()).toJS();
        this.videos.map((video, index) => {
            if (video.youtubeId === this.props.heroYoutubeId) {
                video.isActive = true;
                heroVideo = Immutable.fromJS(video);
                slideIndex = Math.floor(index / this.props.videoPerPage);
            }
        }, this);

        // if no video found as active, choose the 1st one
        if (heroVideo === undefined) {
            this.videos[0].isActive = true;
            heroVideo = Immutable.fromJS(this.videos[0]);
        }
        slides = Immutable.fromJS(_.chunk(this.videos, this.props.videoPerPage));

        this.setState({
            slides: slides,
            heroVideo: heroVideo,
            slideIndex: slideIndex
        });
    },
    componentDidMount() {
        this.slideTimestamp = new Date();
    },
    handleIndexChange(step) {
        var currentTimestamp = new Date();
        var slideLength = this.state.slides.size;

        if (currentTimestamp - this.slideTimestamp < this.props.gapBetweenClick) {
            return;
        }
        this.slideTimestamp = currentTimestamp;

        this.setState({
            slideIndex: (this.state.slideIndex + slideLength + step) % slideLength,
            slideAnimation: (step > 0 ? 'hero-slide-left' : 'hero-slide-right')
        });
    },
    render() {
        var leftButton = null;
        var rightButton = null;

        if (this.state.slideIndex !== 0) {
            leftButton = (
                <span className="NavButton Left" onClick={this.handleIndexChange.bind(this, -1)}></span>
            );
        }

        if (this.state.slideIndex !== this.state.slides.size - 1) {
            rightButton = (
                <span className="NavButton Right" onClick={this.handleIndexChange.bind(this, 1)}></span>
            );
        }
        return (
            <div className="HeroStream">
                <h2 className="StreamTitle">{this.props.stream.get('title')}</h2>
                <HeroVideo video={this.state.heroVideo} shouldAutoplay={!!this.props.heroYoutubeId}/>
                <div className="HeroSlideViewport">
                    <ReactCSSTransitionGroup transitionName={this.state.slideAnimation}>
                        <HeroSlide key={this.state.slideIndex}
                            streamName={this.props.stream.get('name')}
                            videos={this.state.slides.get(this.state.slideIndex)} />
                    </ReactCSSTransitionGroup>
                </div>
                {this.state.slides.size === 0 ? null : <div className="HeroNavButtonContainer">{leftButton}{rightButton}</div>}
            </div>
        );
    }
});

export default HeroStream;
