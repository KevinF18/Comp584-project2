from flask import Blueprint, request, render_template, abort, jsonify
import essentia.standard as es
from werkzeug.utils import secure_filename

api_blueprint = Blueprint('api_blueprint', __name__ )
import os
@api_blueprint.route("/file_tempo",methods=["POST"])
def file_tempo():
    file = request.files['my_audio_file']
    filename = secure_filename(file.filename)
    file.save(os.path.join('/tmp', filename))
    audio = es.MonoLoader(filename='/tmp/'+file.filename)()
    rhythm_extractor = es.RhythmExtractor2013(method="multifeature")
    bpm, beats, beats_confidence, _, beats_intervals = rhythm_extractor(audio)
    peak1_bpm, peak1_weight, peak1_spread, peak2_bpm, peak2_weight, peak2_spread, histogram = \
    es.BpmHistogramDescriptors()(beats_intervals)
    info = {
        "filename": file.filename,
        "overall_tempo": bpm,
        "peak_1": peak1_bpm,
        "peak_2": peak2_bpm 
    }
    return jsonify(info)