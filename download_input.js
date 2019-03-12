import React, { Component } from 'react';

import './CHB.css';
import Navigation from '../Navigation';
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import JSZipUtils from 'jszip-utils'

   
let Promise = window.Promise;
if (!Promise) {
  Promise = JSZip.external.Promise;
}

/**
 * Fetch the content and return the associated promise.
 * @param {String} url the url of the content to fetch.
 * @return {Promise} the promise containing the data.
 */
function urlToPromise(url) {
  return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(url, (err, data) => {
          if(err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}


export default class CHB extends Component {

      state = {
        topics: [],
        isLoaded: false, 
        value: '',
        imageFilter: null,
        imageFilterAll: null,
      } 

      

      //RESET STATE FOR CHECK ALL
      resetState = () => {
        this.setState({
        value: '',
        imageFilter: null,
        imageFilterAll: null
        })
      }


      //RETRIEVE API SUBGALLERY API
      fetch_data_subgallery = () => {
        return fetch(`/wordpress/fr/wp-json/mediatheque/v1/home/subgallery`)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            topics: responseJson,
            isLoaded: true
          })
        })
        .catch((error) => {
          console.error(error);
        })
      }
      componentDidMount() {
        this.fetch_data_subgallery()
    }

    //RECUPERER LES DATAS FILTRES POUR CHECKBOX THEMES
    handleChange = (event) => {
      const { value } = event.target;
      const imageFilter = this.getFilterImg(value);
      this.setState({ value, imageFilter });
    };
    getFilterImg = (value) => {
      const { topics } = this.state;
      if (value) {
        return topics.collections[0].chb[0].tous.filter(filter => filter.alt === value);
      }
      return null;
    };



downloadZip = () => {
  
    var zip = new JSZip();

          // find every checked item
          let checkboxes = document.querySelectorAll('.js-checkbox')
          let checkedBoxes = [];
          //on boucle sur nos checbox
          for (var i=0; i<checkboxes.length; i++) {
              if (checkboxes[i].checked) {
                  //si la checbox est checkée, je laotue au tbleau "$checkedBoxes"
                  checkedBoxes.push(checkboxes[i]);
              }
          }
          checkedBoxes.forEach( (el, index) => {
              //la on part du principe que tes checbox on un data-attribute="" avec lurl de limage
              var url = el.getAttribute("data-url");
              var filename = url.replace(/.*\//g, "");
            zip.file(filename, urlToPromise(url), {binary:true});
        });

        // when everything has been downloaded, we can trigger the dl
        zip.generateAsync({type:"blob"}, (metadata) => {
            var msg = "progression : " + metadata.percent.toFixed(2) + " %";
            if(metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            console.log(msg);
            console.log(metadata.percent|0);
        })
        .then((blob, e) => {

        // see FileSaver.js
        saveAs(blob, "dcd_mediatheque.zip");
        e.preventDefault();
        console.log("done !");
    },  (e) => {
      console.log(e);

    });

    return false;
};




     

  render() {
    const { isLoaded } = this.state;
    const { topics, imageFilter,allImgForMultiple} = this.state;
    // console.log(value, "value");
    // console.log(imageFilterAll, "imageFilterAll");
    // console.log(imageFilter, "imageFilter");
    // console.log(ImgAnswer, "MULTIPLE");
    console.log(allImgForMultiple, "ALL");
 
       

    if( !isLoaded ) {
        return (
          <div></div>
        );
      } else {
       

    return (
        <React.Fragment>
          <Navigation/>
          
          <div className="section">
          <div className="col grid_1_of_2"> 
                <div className="filters">
                    <div className="manage">
                        <p className="title_manage">
                            {topics.collections[0].chb[0].title}
                        </p>
                        <hr className="styleHr"></hr>
                        <div className="lesInput">
                          <label>
                            <div className="input_one">
                              <input 
                              type='radio' 
                              value="tous" onChange={this.resetState}
                              checked={this.state.value === ''}
                              />
                              <span></span>
                              {topics.filtres[0].filtre_1}
                            </div>
                          </label>
                            
                          <br />
                          <label>
                            <div className="input_two">
                              <input 
                              type='radio' 
                              value={topics.filtres[0].filtre_2} 
                              onChange={this.handleChange}
                              checked={this.state.value === topics.filtres[0].filtre_2 || this.state.value === 'La propriété'}></input>
                              <span></span>
                              {topics.filtres[0].filtre_2}
                            </div>
                          </label>
                          <br />
                          <label>
                            <div className="input_three">
                              <input 
                              type='radio' 
                              value={topics.filtres[0].filtre_3}
                              onChange={this.handleChange} 
                              checked={this.state.value === topics.filtres[0].filtre_3 || this.state.value === 'Les vins'}/>
                              <span></span>
                              {topics.filtres[0].filtre_3}
                            </div>
                          </label>
                          <br />
                          <label>
                            <div className="input_four">
                              <input 
                              type='radio' 
                              value={topics.filtres[0].filtre_4} 
                              onChange={this.handleChange}
                              checked={this.state.value === topics.filtres[0].filtre_4 || this.state.value === 'Les hommes'}/>
                              <span></span>
                              {topics.filtres[0].filtre_4}
                            </div>
                          </label>
                          <br />
                          <label>
                            <div className="input_five">
                              <input 
                              type='radio' 
                              value={topics.filtres[0].filtre_5}
                              onChange={this.handleChange} 
                              checked={this.state.value === topics.filtres[0].filtre_5 || this.state.value === 'Les salons privés'}/>
                              <span></span>
                              {topics.filtres[0].filtre_5}
                            </div>
                          </label>
                          <br />
                        </div>


                    </div>
                    </div>
                </div>
                <div className="collec">
                  <div className="bandeau_resol_tel">
                      Résolution
                      <input className="checkbox" type='checkbox'/>
                      <span className="resol"> HD </span>
                      <input type='checkbox'/>
                      <span className="resol"> BD </span>

                      <input className="checkbox" type='checkbox'/>
                      <span className="tel" onClick={this.downloadZip} download> Télécharger ma sélection </span>   
                  </div>
                  </div>

              {topics.collections[0].chb[0].tous && !imageFilter ? 
              topics.collections[0].chb[0].tous.map((image , index) => 
              
              <div className="collec">
                              <div className="col grid_2_of_2">
                                <div className="card_collections">
                                <div className="card_image_collections">
                                  <img key={index} src={image.sizes.medium_large} alt=""/>
                                </div>
                                  <div className="title_card_subcollection">
                                    <label>
                                    <div className="input">
                                      <input type='checkbox'
                                      data-url={image.url}
                                      className="js-checkbox"
                                       />
                                      <span></span>
                                 
                                      <a key={index} href={image.url} download>  
                                            

                                      <img src={require('../../../img/telecharger.png')} alt="" className="icon_telecharger"/>

                                      </a>
                                  </div>  
                                  </label>
                                  </div>
                                </div>
                                </div>
                                </div>
              )        
       
              : imageFilter
              ? imageFilter.map((image, index) => (
                <div className="collec">
                <div className="col grid_2_of_2">
                  <div className="card_collections">
                  <div className="card_image_collections">
                    <img key={index} src={image.sizes.medium_large} alt=""/>
                  </div>
                    <div className="title_card_subcollection">
                      <label>
                      <div className="input">
                        <input type='checkbox'
                        data-url={image.url}
                        className="js-checkbox"
                        />
                        <span></span>
                        <a key={index} href={image.url} download>
                          <img src={require('../../../img/telecharger.png')} alt="" className="icon_telecharger"/>
                        </a>
                      </div>  
                    </label>
                    </div>
                  </div>
                  </div>
                  </div>
                ))

                
              : null
            
              }
                
                      
           </div>              
                 
          
        </React.Fragment>

    )
    }
  }
}
