// @ts-nocheck
import { Affix, Card, Col, Image, Row } from "antd";
import React, { useEffect, useState } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import VideoOrImage from "../../components/videoOrImage";
import { projectThunk } from "../../redux/actions";
import style from "./style.module.scss";
import Header from "../../components/header";
import { BrowserView, MobileView } from "react-device-detect";
import i18next from "i18next";

function ProjectPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState(i18next.language);
  const projectData = useSelector((state) => state.project.project);
  const loading = useSelector((state) => state.project.loading);

  useEffect(() => {
    if (id !== undefined) {
      const projectImages = async () => {
        await dispatch(projectThunk({ id }));
      };
      projectImages();
    }
  }, [dispatch, id]);

  useEffect(() => {
    i18next.on("languageChanged", (lng) => {
      setLanguage(lng);
    });
  }, []);

  const condition =
    loading === false &&
    projectData !== null &&
    projectData !== undefined &&
    projectData.images !== undefined &&
    projectData.images !== null &&
    projectData.description !== undefined &&
    projectData.description !== null &&
    projectData.title !== null &&
    projectData.title !== undefined;

  return (
    <div>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.container}>
        <Row align="top" gutter={16}>
          <Col md={8} sm={24} style={{ width: "100%" }}>
            <Card loading={loading} bordered={false}>
              {condition && (
                <div>
                  <BrowserView>
                    <Affix offsetTop={120}>
                      <div className={style.title}>
                        <div> {projectData.title} </div>
                        <div> {projectData.subtitle}</div>
                      </div>
                      {language === "en" ? (
                        <div className={style.description}>
                          {projectData.description}
                        </div>
                      ) : (
                        <div className={style.description}>
                          {projectData.descriptionIT}
                        </div>
                      )}
                    </Affix>
                  </BrowserView>
                  <MobileView>
                    <div>
                      <div className={style.title}>
                        <div> {projectData.title} </div>
                        <div> {projectData.subtitle}</div>
                      </div>
                      {language === "en" ? (
                        <div className={style.description}>
                          {projectData.description}
                        </div>
                      ) : (
                        <div className={style.description}>
                          {projectData.descriptionIT}
                        </div>
                      )}
                    </div>
                  </MobileView>
                </div>
              )}
            </Card>
          </Col>
          <Col md={16} sm={24} style={{ width: "100%" }}>
            <Image.PreviewGroup>
              <Card loading={loading} bordered={false}>
                <LazyLoadComponent>
                  {condition &&
                    projectData.images.slice(1).map((e) => (
                      <div className={style.images} key={e}>
                        <Row key={e._id}>
                          <VideoOrImage e={e.url} title={projectData.title} />
                        </Row>
                      </div>
                    ))}
                </LazyLoadComponent>
              </Card>
            </Image.PreviewGroup>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default ProjectPage;
